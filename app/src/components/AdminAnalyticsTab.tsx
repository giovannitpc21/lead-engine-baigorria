import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, MousePointer, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface AnalyticsMetrics {
  total_pageviews: number;
  unique_sessions: number;
  total_conversions: number;
  form_starts: number;
  form_submissions: number;
}

interface TopPage {
  page_path: string;
  total_events: number;
  unique_sessions: number;
}

interface TopEvent {
  event_name: string;
  event_type: string;
  count: number;
}

interface MetricData {
  metric_name: string;
  metric_value: string;
}

interface PageData {
  page_path: string;
  session_id: string;
}

interface EventData {
  event_name: string;
  event_type: string;
}

export const AdminAnalyticsTab = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener métricas
      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_seo_metrics', {
          p_start_date: new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          p_end_date: new Date().toISOString().split('T')[0]
        });

      if (metricsError) throw metricsError;

      // Convertir array de métricas a objeto
      const metricsObj: AnalyticsMetrics = {
        total_pageviews: 0,
        unique_sessions: 0,
        total_conversions: 0,
        form_starts: 0,
        form_submissions: 0
      };
      
      (metricsData as MetricData[])?.forEach((m) => {
        if (m.metric_name in metricsObj) {
          metricsObj[m.metric_name as keyof AnalyticsMetrics] = parseInt(m.metric_value);
        }
      });
      setMetrics(metricsObj);

      // Obtener páginas más visitadas
      const { data: pagesData } = await supabase
        .from('analytics_events')
        .select('page_path, session_id')
        .eq('event_type', 'pageview')
        .gte('created_at', new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      // Agrupar por página
      const pageStats: Record<string, { sessions: Set<string> }> = {};
      (pagesData as PageData[])?.forEach((p) => {
        if (!pageStats[p.page_path]) {
          pageStats[p.page_path] = { sessions: new Set() };
        }
        pageStats[p.page_path].sessions.add(p.session_id);
      });

      const topPagesArray: TopPage[] = Object.entries(pageStats)
        .map(([page_path, stats]) => ({
          page_path,
          total_events: stats.sessions.size,
          unique_sessions: stats.sessions.size
        }))
        .sort((a, b) => b.total_events - a.total_events)
        .slice(0, 10);

      setTopPages(topPagesArray);

      // Obtener eventos más comunes
      const { data: eventsData } = await supabase
        .from('analytics_events')
        .select('event_name, event_type')
        .gte('created_at', new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      const eventStats: Record<string, { type: string; count: number }> = {};
      (eventsData as EventData[])?.forEach((e) => {
        const key = `${e.event_type}:${e.event_name}`;
        if (!eventStats[key]) {
          eventStats[key] = { type: e.event_type, count: 0 };
        }
        eventStats[key].count++;
      });

      const topEventsArray: TopEvent[] = Object.entries(eventStats)
        .map(([key, stats]) => ({
          event_name: key.split(':')[1],
          event_type: stats.type,
          count: stats.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTopEvents(topEventsArray);

    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const exportAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const csv = convertToCSV(data || []);
      downloadCSV(csv, `analytics-${dateRange}dias.csv`);
    } catch (err) {
      console.error('Error exporting analytics:', err);
    }
  };

  const convertToCSV = (data: Record<string, unknown>[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'pageview': return 'bg-blue-100 text-blue-800';
      case 'conversion': return 'bg-green-100 text-green-800';
      case 'form_submit': return 'bg-yellow-100 text-yellow-800';
      case 'click': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a962]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Período:</span>
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                dateRange === days
                  ? 'bg-[#c9a962] text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {days} días
            </button>
          ))}
        </div>
        <Button variant="outline" onClick={exportAnalytics}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Pageviews', value: metrics?.total_pageviews || 0, icon: BarChart3, color: 'bg-blue-500' },
          { label: 'Sesiones', value: metrics?.unique_sessions || 0, icon: Users, color: 'bg-green-500' },
          { label: 'Conversiones', value: metrics?.total_conversions || 0, icon: TrendingUp, color: 'bg-[#c9a962]' },
          { label: 'Form Starts', value: metrics?.form_starts || 0, icon: FileText, color: 'bg-purple-500' },
          { label: 'Form Submits', value: metrics?.form_submissions || 0, icon: MousePointer, color: 'bg-pink-500' }
        ].map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</p>
                </div>
                <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Páginas más visitadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          ) : (
            <div className="space-y-3">
              {topPages.map((page, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-900">{page.page_path}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {page.unique_sessions} sesiones
                    </span>
                    <Badge variant="secondary">{page.total_events} vistas</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5" />
            Eventos más comunes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          ) : (
            <div className="space-y-3">
              {topEvents.map((event, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-medium text-gray-900">{event.event_name}</span>
                      <Badge className={`ml-2 ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="secondary">{event.count} eventos</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};