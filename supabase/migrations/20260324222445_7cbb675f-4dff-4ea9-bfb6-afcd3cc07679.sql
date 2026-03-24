-- Client access tokens
CREATE TABLE client_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  client_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Playlist blocks
CREATE TABLE playlist_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Songs
CREATE TABLE playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id uuid REFERENCES playlist_blocks(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  artist text,
  display_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Client song preferences
CREATE TABLE song_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_token_id uuid REFERENCES client_tokens(id) ON DELETE CASCADE NOT NULL,
  song_id uuid REFERENCES playlist_songs(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(client_token_id, song_id)
);

-- Client suggestions
CREATE TABLE song_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_token_id uuid REFERENCES client_tokens(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  artist text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- DJ playlist links
CREATE TABLE dj_playlist_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_token_id uuid REFERENCES client_tokens(id) ON DELETE CASCADE NOT NULL,
  spotify_url text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Block order preferences
CREATE TABLE block_order_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_token_id uuid REFERENCES client_tokens(id) ON DELETE CASCADE NOT NULL,
  block_id uuid REFERENCES playlist_blocks(id) ON DELETE CASCADE NOT NULL,
  display_order int NOT NULL,
  UNIQUE(client_token_id, block_id)
);

-- Enable RLS
ALTER TABLE client_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_playlist_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_order_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "anon_read_tokens" ON client_tokens FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_blocks" ON playlist_blocks FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_songs" ON playlist_songs FOR SELECT TO anon USING (true);
CREATE POLICY "anon_all_preferences" ON song_preferences FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_suggestions" ON song_suggestions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_dj_links" ON dj_playlist_links FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_block_order" ON block_order_preferences FOR ALL TO anon USING (true) WITH CHECK (true);

-- Seed client token
INSERT INTO client_tokens (id, token, client_name) VALUES
  ('20000000-0000-0000-0000-000000000001', 'esther-gabriel-2027', 'Esther & Gabriel');

-- Seed blocks
INSERT INTO playlist_blocks (id, name, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Bloco Opening', 1),
  ('10000000-0000-0000-0000-000000000002', 'Bloco Pop Open', 2),
  ('10000000-0000-0000-0000-000000000003', 'Bloco Internacional 1', 3),
  ('10000000-0000-0000-0000-000000000004', 'Bloco Internacional 2', 4),
  ('10000000-0000-0000-0000-000000000005', 'Bloco Animado 2', 5),
  ('10000000-0000-0000-0000-000000000006', 'Bloco Nacional 1', 6),
  ('10000000-0000-0000-0000-000000000007', 'Bloco Interação', 7),
  ('10000000-0000-0000-0000-000000000008', 'Bloco Potpourri', 8),
  ('10000000-0000-0000-0000-000000000009', 'Bloco Nacional 2', 9),
  ('10000000-0000-0000-0000-000000000010', 'Bloco Nacional 3', 10),
  ('10000000-0000-0000-0000-000000000011', 'Bloco Reggae', 11),
  ('10000000-0000-0000-0000-000000000012', 'Bloco Inter/Reggae', 12),
  ('10000000-0000-0000-0000-000000000013', 'Bloco Auge', 13),
  ('10000000-0000-0000-0000-000000000014', 'Bloco Alternativas', 14),
  ('10000000-0000-0000-0000-000000000015', 'Bloco Forró/Sertanejo', 15),
  ('10000000-0000-0000-0000-000000000016', 'Bloco Axé', 16);

-- Seed songs
INSERT INTO playlist_songs (block_id, title, artist, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'You and I + Heaven', 'Lady Gaga / Bryan Adams', 1),
  ('10000000-0000-0000-0000-000000000001', '93 Million Miles', 'Jason Mraz', 2),
  ('10000000-0000-0000-0000-000000000001', 'So Sick', 'Ne-Yo', 3),
  ('10000000-0000-0000-0000-000000000001', 'Still The One', 'Shania Twain', 4),
  ('10000000-0000-0000-0000-000000000001', 'Don''t Dream is Over + Human Nature', 'Crowded House / Michael Jackson', 5),
  ('10000000-0000-0000-0000-000000000001', 'Circles', 'Post Malone', 6),
  ('10000000-0000-0000-0000-000000000001', 'Hey Yah', 'OutKast', 7),
  ('10000000-0000-0000-0000-000000000001', 'Best Part', 'Daniel Caesar ft. H.E.R.', 8),
  ('10000000-0000-0000-0000-000000000001', 'I Feel It Coming', 'The Weeknd ft. Daft Punk', 9),
  ('10000000-0000-0000-0000-000000000001', 'Perfect Strangers', 'Jonas Blue ft. JP Cooper', 10),
  ('10000000-0000-0000-0000-000000000001', 'What Goes Around / Mirrors', 'Justin Timberlake', 11),
  ('10000000-0000-0000-0000-000000000002', 'Adventure of a Lifetime', 'Coldplay', 1),
  ('10000000-0000-0000-0000-000000000002', 'Amei Te Ver / Please Don''t Stop The Music', 'Tiago Iorc / Rihanna', 2),
  ('10000000-0000-0000-0000-000000000002', 'Sunday Morning', 'Maroon 5', 3),
  ('10000000-0000-0000-0000-000000000002', 'This Love', 'Maroon 5', 4),
  ('10000000-0000-0000-0000-000000000003', 'Valerie', 'Amy Winehouse', 1),
  ('10000000-0000-0000-0000-000000000003', 'Stand By Me / Have You Ever Seen The Rain', 'Ben E. King / CCR', 2),
  ('10000000-0000-0000-0000-000000000003', 'Every Breath You Take', 'The Police', 3),
  ('10000000-0000-0000-0000-000000000003', 'Rock with You', 'Michael Jackson', 4),
  ('10000000-0000-0000-0000-000000000004', 'I''m Yours', 'Jason Mraz', 1),
  ('10000000-0000-0000-0000-000000000004', 'Wake Me Up', 'Avicii', 2),
  ('10000000-0000-0000-0000-000000000004', 'Love Never Felt So Good', 'Michael Jackson', 3),
  ('10000000-0000-0000-0000-000000000004', 'Can''t Stop the Feeling', 'Justin Timberlake', 4),
  ('10000000-0000-0000-0000-000000000004', 'September', 'Earth Wind & Fire', 5),
  ('10000000-0000-0000-0000-000000000004', 'Rock Your Body', 'Justin Timberlake', 6),
  ('10000000-0000-0000-0000-000000000004', 'Sugar', 'Maroon 5', 7),
  ('10000000-0000-0000-0000-000000000004', 'Treasure', 'Bruno Mars', 8),
  ('10000000-0000-0000-0000-000000000004', 'Happy', 'Pharrell Williams', 9),
  ('10000000-0000-0000-0000-000000000004', 'Locked out of Heaven', 'Bruno Mars', 10),
  ('10000000-0000-0000-0000-000000000004', '24K Magic', 'Bruno Mars', 11),
  ('10000000-0000-0000-0000-000000000005', 'Get Lucky / O Sol', 'Daft Punk / Vitor Kley', 1),
  ('10000000-0000-0000-0000-000000000005', 'Moves Like Jagger', 'Maroon 5', 2),
  ('10000000-0000-0000-0000-000000000005', 'As It Was', 'Harry Styles', 3),
  ('10000000-0000-0000-0000-000000000006', 'Lilás', 'Djavan', 1),
  ('10000000-0000-0000-0000-000000000006', 'Toda Forma de Amor', 'Lulu Santos', 2),
  ('10000000-0000-0000-0000-000000000006', 'Além do Horizonte', 'Jota Quest', 3),
  ('10000000-0000-0000-0000-000000000006', 'Carla', 'Jorge Vercillo', 4),
  ('10000000-0000-0000-0000-000000000006', 'Meu Erro', 'Paralamas do Sucesso', 5),
  ('10000000-0000-0000-0000-000000000007', 'Billie Jean', 'Michael Jackson', 1),
  ('10000000-0000-0000-0000-000000000007', 'Stayin'' Alive', 'Bee Gees', 2),
  ('10000000-0000-0000-0000-000000000007', 'Shape of You', 'Ed Sheeran', 3),
  ('10000000-0000-0000-0000-000000000007', 'Livin'' On A Prayer', 'Bon Jovi', 4),
  ('10000000-0000-0000-0000-000000000007', 'Uptown Funk', 'Bruno Mars ft. Mark Ronson', 5),
  ('10000000-0000-0000-0000-000000000008', 'Wonderwall', 'Oasis', 1),
  ('10000000-0000-0000-0000-000000000008', 'A Thousand Miles', 'Vanessa Carlton', 2),
  ('10000000-0000-0000-0000-000000000008', 'I Want It That Way', 'Backstreet Boys', 3),
  ('10000000-0000-0000-0000-000000000008', 'Quero Te Encontrar', 'Claudinho e Buchecha', 4),
  ('10000000-0000-0000-0000-000000000008', 'Turu Turu', 'Mc Koringa', 5),
  ('10000000-0000-0000-0000-000000000009', 'Mulher de Fases', 'Raimundos', 1),
  ('10000000-0000-0000-0000-000000000009', 'Lutar Pelo Que É Meu', 'Charlie Brown Jr.', 2),
  ('10000000-0000-0000-0000-000000000009', 'Ela Vai Voltar', 'Charlie Brown Jr.', 3),
  ('10000000-0000-0000-0000-000000000010', 'Pescador de Ilusões / Minha Alma', 'O Rappa', 1),
  ('10000000-0000-0000-0000-000000000010', 'Zóio de Lula', 'Charlie Brown Jr.', 2),
  ('10000000-0000-0000-0000-000000000010', 'Pontes Indestrutíveis', 'Charlie Brown Jr.', 3),
  ('10000000-0000-0000-0000-000000000010', 'Te Levar Daqui', 'Fresno', 4),
  ('10000000-0000-0000-0000-000000000010', 'Razões e Emoções', 'Nx Zero', 5),
  ('10000000-0000-0000-0000-000000000010', 'Cedo ou Tarde', 'Nx Zero', 6),
  ('10000000-0000-0000-0000-000000000011', 'Ursinho de Dormir', 'Cidade Negra', 1),
  ('10000000-0000-0000-0000-000000000011', 'Desenho de Deus', 'Armandinho', 2),
  ('10000000-0000-0000-0000-000000000011', 'Is This Love / Vamos Fugir', 'Bob Marley / Skank', 3),
  ('10000000-0000-0000-0000-000000000011', 'Um Anjo do Céu', 'Maskavo', 4),
  ('10000000-0000-0000-0000-000000000011', 'Three Little Birds / Haverá', 'Bob Marley / Skank', 5),
  ('10000000-0000-0000-0000-000000000011', 'Redemption Song', 'Bob Marley', 6),
  ('10000000-0000-0000-0000-000000000012', 'Natiruts Reggae Power', 'Natiruts', 1),
  ('10000000-0000-0000-0000-000000000012', 'Rude', 'MAGIC!', 2),
  ('10000000-0000-0000-0000-000000000012', 'Let Your Hair Down', 'MAGIC!', 3),
  ('10000000-0000-0000-0000-000000000012', 'Quero Ser Feliz Também', 'Natiruts', 4),
  ('10000000-0000-0000-0000-000000000012', 'Sorri Sou Rei', 'Natiruts', 5),
  ('10000000-0000-0000-0000-000000000013', 'Do Leme ao Pontal', 'Tim Maia', 1),
  ('10000000-0000-0000-0000-000000000013', 'O Descobridor dos Sete Mares', 'Tim Maia', 2),
  ('10000000-0000-0000-0000-000000000013', 'Não Quero Dinheiro (Só Quero Amar)', 'Tim Maia', 3),
  ('10000000-0000-0000-0000-000000000013', 'Do Seu Lado', 'Jota Quest', 4),
  ('10000000-0000-0000-0000-000000000013', 'Vou Deixar', 'Skank', 5),
  ('10000000-0000-0000-0000-000000000013', 'Whisky a Go-Go', 'Roupa Nova', 6),
  ('10000000-0000-0000-0000-000000000013', 'La Bamba', 'Ritchie Valens', 7),
  ('10000000-0000-0000-0000-000000000013', 'Banho de Lua', 'Celly Campello', 8),
  ('10000000-0000-0000-0000-000000000013', 'Pelados em Santos', 'Mamonas Assassinas', 9),
  ('10000000-0000-0000-0000-000000000013', 'Anna Júlia', 'Los Hermanos', 10),
  ('10000000-0000-0000-0000-000000000014', 'Use Somebody', 'Kings of Leon', 1),
  ('10000000-0000-0000-0000-000000000014', 'Like a Stone', 'Audioslave', 2),
  ('10000000-0000-0000-0000-000000000014', 'Don''t Stop Believin''', 'Journey', 3),
  ('10000000-0000-0000-0000-000000000014', 'The Final Countdown', 'Europe', 4),
  ('10000000-0000-0000-0000-000000000014', 'Numb', 'Linkin Park', 5),
  ('10000000-0000-0000-0000-000000000014', 'In The End', 'Linkin Park', 6),
  ('10000000-0000-0000-0000-000000000014', 'It''s My Life', 'Bon Jovi', 7),
  ('10000000-0000-0000-0000-000000000014', 'Losing My Religion', 'R.E.M.', 8),
  ('10000000-0000-0000-0000-000000000014', 'Beautiful Day', 'U2', 9),
  ('10000000-0000-0000-0000-000000000014', 'Sunday Bloody Sunday', 'U2', 10),
  ('10000000-0000-0000-0000-000000000014', 'I Still Haven''t Found What I''m Looking For', 'U2', 11),
  ('10000000-0000-0000-0000-000000000014', 'I''ll Be Over You', 'Toto', 12),
  ('10000000-0000-0000-0000-000000000014', 'Africa', 'Toto', 13),
  ('10000000-0000-0000-0000-000000000014', 'Hold The Line', 'Toto', 14),
  ('10000000-0000-0000-0000-000000000014', 'It''s a Man''s Man''s Man''s World', 'James Brown', 15),
  ('10000000-0000-0000-0000-000000000014', 'Blinding Lights', 'The Weeknd', 16),
  ('10000000-0000-0000-0000-000000000014', 'Can''t Stop', 'Red Hot Chili Peppers', 17),
  ('10000000-0000-0000-0000-000000000014', 'Californication', 'Red Hot Chili Peppers', 18),
  ('10000000-0000-0000-0000-000000000014', 'Best of You', 'Foo Fighters', 19),
  ('10000000-0000-0000-0000-000000000014', 'I Don''t Want To Miss A Thing', 'Aerosmith', 20),
  ('10000000-0000-0000-0000-000000000014', 'Makes Me Wonder', 'Maroon 5', 21),
  ('10000000-0000-0000-0000-000000000015', 'Forró Medley Anunciação', 'Alceu Valença', 1),
  ('10000000-0000-0000-0000-000000000015', 'Sinônimos / Everything I Do', 'Chitãozinho e Xororó / Bryan Adams', 2),
  ('10000000-0000-0000-0000-000000000016', 'Abalou', 'Chiclete com Banana', 1),
  ('10000000-0000-0000-0000-000000000016', 'Taj Mahal / Filho Maravilha / País Tropical / Arerê', 'Medley Axé', 2),
  ('10000000-0000-0000-0000-000000000016', 'Sou Guerreiro', 'Ara Ketu', 3),
  ('10000000-0000-0000-0000-000000000016', 'Mila', 'Netinho', 4);