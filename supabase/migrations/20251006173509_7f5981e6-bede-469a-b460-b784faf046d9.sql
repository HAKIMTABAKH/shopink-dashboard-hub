-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'Unpaid';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items_count INTEGER NOT NULL DEFAULT 0;

-- Generate order numbers for existing records
DO $$
DECLARE
  r RECORD;
  counter INT := 1;
BEGIN
  FOR r IN SELECT id FROM public.orders WHERE order_number IS NULL ORDER BY created_at
  LOOP
    UPDATE public.orders 
    SET order_number = 'ORD-' || LPAD(counter::TEXT, 6, '0')
    WHERE id = r.id;
    counter := counter + 1;
  END LOOP;
END $$;

-- Make order_number NOT NULL after setting values
ALTER TABLE public.orders ALTER COLUMN order_number SET NOT NULL;

-- Create function to auto-generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INT;
BEGIN
  IF NEW.order_number IS NULL THEN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_num
    FROM public.orders
    WHERE order_number ~ '^ORD-[0-9]+$';
    
    NEW.order_number := 'ORD-' || LPAD(next_num::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate order numbers on insert
DROP TRIGGER IF EXISTS trg_generate_order_number ON public.orders;
CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();