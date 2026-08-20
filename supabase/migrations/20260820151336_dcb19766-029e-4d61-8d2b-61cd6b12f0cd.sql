DROP FUNCTION IF EXISTS public.increment_view_count(text);

REVOKE ALL ON FUNCTION public.get_public_proposal(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_proposal(text, jsonb, text, text[], jsonb, text, numeric, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_playlist_session(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.add_song_suggestion(text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_song_suggestion(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.add_dj_playlist_link(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_dj_playlist_link(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_song_preference(text, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_block_orders(text, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_song_orders(text, jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_public_proposal(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accept_proposal(text, jsonb, text, text[], jsonb, text, numeric, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_playlist_session(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_song_suggestion(text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_song_suggestion(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_dj_playlist_link(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_dj_playlist_link(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_song_preference(text, uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_block_orders(text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_song_orders(text, jsonb) TO anon, authenticated;