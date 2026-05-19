-- Colle ce SQL dans l'éditeur SQL de ton projet Supabase

CREATE TABLE stands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stand_name TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  plat TEXT,
  prix TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Désactiver Row Level Security (accès uniquement via ta service key côté serveur)
ALTER TABLE stands DISABLE ROW LEVEL SECURITY;

-- Insérer les 19 stands avec leurs tokens uniques
INSERT INTO stands (stand_name, token) VALUES
  ('L''accolade',            'acc-7k2m9p'),
  ('Bap',                    'bap-3n8xq1'),
  ('Chez Baba',              'bab-5r4tw6'),
  ('Glacier Catalan',        'gla-9j2ks8'),
  ('Break',                  'brk-1m7vd3'),
  ('Stan Dog',               'std-4e9nb5'),
  ('La casa di fratelli',    'cas-8p3yl7'),
  ('Pappadum',               'pap-2x6hc4'),
  ('Focaccia & amici',       'foc-6q1rz9'),
  ('La famille',             'fam-3w8dt2'),
  ('Maximus',                'max-7b4mk5'),
  ('Skewy',                  'skw-9n2pe8'),
  ('La frabrique à choux',   'fra-5j7xv1'),
  ('Tonnerre de breizh',     'ton-1y4ks6'),
  ('La Kaz''odile',          'kaz-8m3qt9'),
  ('Ban aloun',              'ban-4c7rn2'),
  ('Bar à viandes',          'bar-6h1pw5'),
  ('Tata yoyo',              'tat-2e9bm7'),
  ('Abba',                   'abb-5v3dk4');
