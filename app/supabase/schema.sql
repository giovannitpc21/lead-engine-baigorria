-- =====================================================
-- Lead Engine - Grupo Baigorria
-- Supabase Schema (PostgreSQL)
-- Iteración 2 (CORREGIDA)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: advisors
-- Asesores inmobiliarios
-- =====================================================
CREATE TABLE advisors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    foto_url TEXT,
    especialidad VARCHAR(100),
    zonas TEXT[],
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0,
    leads_count INTEGER DEFAULT 0,

    CONSTRAINT valid_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

-- =====================================================
-- TABLE: leads
-- =====================================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'nuevo',

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),

    tipo_propiedad VARCHAR(50),
    direccion TEXT,
    departamento VARCHAR(100),
    barrio VARCHAR(100),
    metros_cubiertos DECIMAL(10,2),
    metros_totales DECIMAL(10,2),
    ambientes INTEGER,
    dormitorios INTEGER,
    banos INTEGER,
    estado VARCHAR(50),
    extras TEXT[],

    presupuesto_min DECIMAL(15,2),
    presupuesto_max DECIMAL(15,2),
    zona_preferida VARCHAR(100),

    experiencia TEXT,
    mensaje TEXT,
    cv_url TEXT,

    assigned_advisor_id UUID REFERENCES advisors(id) ON DELETE SET NULL,
    property_id UUID,

    source VARCHAR(50) DEFAULT 'web',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    ip_address INET,
    user_agent TEXT,

    CONSTRAINT valid_type CHECK (
        type IN (
            'vender','comprar','alquilar',
            'administracion','contacto',
            'trabaja-con-nosotros','tasacion'
        )
    ),
    CONSTRAINT valid_status CHECK (
        status IN ('nuevo','contactado','en-proceso','cerrado','descartado')
    )
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: properties
-- =====================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL,
    operacion VARCHAR(50) NOT NULL,

    direccion VARCHAR(255) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    barrio VARCHAR(100) NOT NULL,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),

    precio DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    metros_cubiertos DECIMAL(10,2) NOT NULL,
    metros_totales DECIMAL(10,2),
    ambientes INTEGER NOT NULL,
    dormitorios INTEGER NOT NULL,
    banos INTEGER NOT NULL,
    estado VARCHAR(50),

    garage BOOLEAN DEFAULT FALSE,
    patio BOOLEAN DEFAULT FALSE,
    pileta BOOLEAN DEFAULT FALSE,
    extras TEXT[],

    imagenes TEXT[] DEFAULT '{}',
    imagen_principal TEXT,

    advisor_id UUID NOT NULL REFERENCES advisors(id) ON DELETE RESTRICT,

    activa BOOLEAN DEFAULT TRUE,
    destacada BOOLEAN DEFAULT FALSE,
    fecha_publicacion DATE DEFAULT CURRENT_DATE,

    CONSTRAINT valid_tipo CHECK (
        tipo IN ('casa','departamento','terreno','local','oficina','galpon','campo','ph')
    ),
    CONSTRAINT valid_operacion CHECK (
        operacion IN ('venta','alquiler','alquiler-temporal')
    ),
    CONSTRAINT valid_moneda CHECK (moneda IN ('ARS','USD'))
);

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: valuation_rules  ✅ CORREGIDA
-- =====================================================
CREATE TABLE valuation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    tipo_propiedad VARCHAR(50) NOT NULL,
    departamento VARCHAR(100) NOT NULL,

    -- Precios base por m2
    precio_m2_cubierto DECIMAL(10,2),
    precio_m2_terreno DECIMAL(10,2),

    multiplicador_estado JSONB DEFAULT '{
        "nuevo": 1.1,
        "bueno": 1.0,
        "regular": 0.9,
        "a-renovar": 0.75
    }'::jsonb,

    multiplicador_extras JSONB DEFAULT '{
        "garage": 1.02,
        "patio": 1.02,
        "pileta": 1.03,
        "parrilla": 1.01,
        "aire": 1.01,
        "calefaccion": 1.01,
        "seguridad": 1.02,
        "amenities": 1.02
    }'::jsonb,

    activo BOOLEAN DEFAULT TRUE,

    UNIQUE (tipo_propiedad, departamento),

    CONSTRAINT valuation_rules_precio_check CHECK (
        (tipo_propiedad = 'terreno'
            AND precio_m2_terreno IS NOT NULL
            AND precio_m2_cubierto IS NULL)
        OR
        (tipo_propiedad <> 'terreno'
            AND precio_m2_cubierto IS NOT NULL)
    )
);

-- =====================================================
-- TABLE: webhook_events
-- =====================================================
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,

    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,

    CONSTRAINT valid_event_type CHECK (
        event_type IN (
            'lead.created',
            'lead.updated',
            'property.created',
            'property.updated',
            'valuation.completed'
        )
    )
);

CREATE INDEX idx_webhook_events_unprocessed
ON webhook_events(processed, created_at)
WHERE processed = FALSE;

-- =====================================================
-- RLS
-- =====================================================
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advisors public read"
ON advisors FOR SELECT
USING (activo = TRUE);

CREATE POLICY "Leads public insert"
ON leads FOR INSERT
WITH CHECK (true);

CREATE POLICY "Leads admin all"
ON leads FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Properties public read"
ON properties FOR SELECT
USING (activa = TRUE);

CREATE POLICY "Properties admin all"
ON properties FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Valuation rules public read"
ON valuation_rules FOR SELECT
USING (activo = TRUE);

CREATE POLICY "Webhook events admin all"
ON webhook_events FOR ALL
USING (auth.role() = 'authenticated');

-- =====================================================
-- TABLE: valuations
-- =====================================================
CREATE TABLE valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    tipo_propiedad VARCHAR(50) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    barrio VARCHAR(100),
    metros_cubiertos DECIMAL(10,2) NOT NULL,
    metros_totales DECIMAL(10,2),
    dormitorios INTEGER,
    banos INTEGER,
    estado VARCHAR(50) NOT NULL,
    extras TEXT[],

    valor_minimo DECIMAL(15,2) NOT NULL,
    valor_maximo DECIMAL(15,2) NOT NULL,
    valor_estimado DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',

    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(255),
    telefono VARCHAR(50),

    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

    ip_address INET,
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100)
);

CREATE INDEX idx_valuations_tipo_depto
ON valuations(tipo_propiedad, departamento);

CREATE INDEX idx_valuations_created_at
ON valuations(created_at DESC);

ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Valuations public insert"
ON valuations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Valuations admin all"
ON valuations FOR ALL
USING (auth.role() = 'authenticated');

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO advisors (nombre, apellido, email, telefono, whatsapp, especialidad, zonas, orden) VALUES
('Juan', 'Pérez', 'juan.perez@grupobaigorria.com', '+5492617166129', '5492617166129', 'Ventas residenciales', ARRAY['ciudad','godoy-cruz'], 1),
('María', 'González', 'maria.gonzalez@grupobaigorria.com', '+5492613907452', '5492613907452', 'Alquileres y administración', ARRAY['guaymallen','las-heras'], 2);

INSERT INTO valuation_rules (tipo_propiedad, departamento, precio_m2_cubierto, precio_m2_terreno) VALUES
('casa', 'ciudad', 1400, 500),
('casa', 'godoy-cruz', 1200, 400),
('casa', 'guaymallen', 1000, 350),
('casa', 'lujan-de-cuyo', 1300, 450),
('departamento', 'ciudad', 1600, NULL),
('departamento', 'godoy-cruz', 1400, NULL),
('departamento', 'lujan-de-cuyo', 1500, NULL),
('terreno', 'ciudad', NULL, 600),
('terreno', 'godoy-cruz', NULL, 450),
('terreno', 'maipu', NULL, 300);

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION assign_advisor_round_robin()
RETURNS UUID AS $$
DECLARE
    selected_advisor UUID;
BEGIN
    SELECT id INTO selected_advisor
    FROM advisors
    WHERE activo = TRUE
    ORDER BY leads_count ASC, orden ASC
    LIMIT 1;

    RETURN selected_advisor;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_lead_with_assignment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assigned_advisor_id IS NULL THEN
        NEW.assigned_advisor_id := assign_advisor_round_robin();

        IF NEW.assigned_advisor_id IS NOT NULL THEN
            UPDATE advisors
            SET leads_count = leads_count + 1
            WHERE id = NEW.assigned_advisor_id;
        END IF;
    END IF;

    INSERT INTO webhook_events (event_type, payload)
    VALUES ('lead.created', jsonb_build_object('lead_id', NEW.id, 'type', NEW.type));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_assignment_trigger
BEFORE INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION create_lead_with_assignment();

-- =====================================================
-- VIEWS
-- =====================================================
CREATE VIEW leads_with_advisor AS
SELECT
    l.*,
    a.nombre  AS advisor_nombre,
    a.apellido AS advisor_apellido,
    a.email AS advisor_email,
    a.telefono AS advisor_telefono,
    a.whatsapp AS advisor_whatsapp
FROM leads l
LEFT JOIN advisors a ON l.assigned_advisor_id = a.id;

CREATE VIEW properties_with_advisor AS
SELECT
    p.*,
    a.nombre AS advisor_nombre,
    a.apellido AS advisor_apellido,
    a.whatsapp AS advisor_whatsapp
FROM properties p
JOIN advisors a ON p.advisor_id = a.id
WHERE p.activa = TRUE;
