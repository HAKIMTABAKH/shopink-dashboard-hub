
-- Enable replication for realtime functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
