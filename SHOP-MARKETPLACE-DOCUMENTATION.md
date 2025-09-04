# Shop/Marketplace Documentation - Making it Work with Real Data

## Current State
The GearPage component has hardcoded mock data:
- `shopCategories` - hardcoded array of category objects
- `featuredProducts` - hardcoded array of product objects

## Exact Data Structure from UI Mock Data

### Shop Categories (Required Fields)
```javascript
shopCategories = [
  {
    title: string,           // "Event Merch"
    description: string,     // "Official merchandise from your favorite local events"
    path: string,           // "/shop/merch" 
    image: string           // Full image URL
  }
]
```

**Current Mock Categories:**
1. Event Merch → `/shop/merch`
2. Local Artist Goods → `/shop/artist-goods`
3. Vintage Finds → `/shop/vintage`
4. Ticket Packages → `/shop/tickets`
5. Gift Ideas → `/shop/gifts`

### Featured Products (Required Fields)
```javascript
featuredProducts = [
  {
    id: string,             // "product-1"
    name: string,           // "Clearwater Jazz Holiday 2024 T-Shirt"
    image: string,          // Full image URL
    price: string,          // "$24.99" (formatted with $)
    category: string,       // "Event Merch"
    
    // Optional metadata (varies by product type):
    event?: string,         // "Clearwater Jazz Holiday"
    artist?: string,        // "Sarah's Ceramics"
    era?: string,           // "1960s-1970s"
    includes?: string,      // "3 concerts + exclusive t-shirt"
    featured?: string       // "3 albums from local artists"
  }
]
```

**Current Mock Products:**
1. Clearwater Jazz Holiday 2024 T-Shirt ($24.99, Event Merch, event: "Clearwater Jazz Holiday")
2. Handcrafted Beach Pottery ($35.00, Local Artist Goods, artist: "Sarah's Ceramics")
3. Vintage Clearwater Postcard Set ($12.50, Vintage Finds, era: "1960s-1970s")
4. Summer Concert Series Package ($89.99, Ticket Packages, includes: "3 concerts + exclusive t-shirt")
5. Local Music Vinyl Collection ($45.00, Gift Ideas, featured: "3 albums from local artists")
6. Beach Festival Essentials Kit ($29.99, Event Merch, includes: "Sunglasses, water bottle, tote bag")

## Database Tables Needed

### Option 1: Create New Tables
```sql
-- Product categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  description text,
  path varchar(255) NOT NULL,
  image_url varchar(1000),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url varchar(1000),
  category_id uuid REFERENCES public.product_categories(id),
  category_name varchar(255), -- denormalized for display
  
  -- Flexible metadata for different product types
  metadata jsonb DEFAULT '{}',
  -- Examples:
  -- For event merch: {"event": "Clearwater Jazz Holiday"}
  -- For artist goods: {"artist": "Sarah's Ceramics"}
  -- For vintage: {"era": "1960s-1970s"}
  -- For packages: {"includes": "3 concerts + exclusive t-shirt"}
  
  stock_quantity integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  -- Relations
  event_id uuid REFERENCES public.events(id),
  performer_id uuid REFERENCES public.performers(id),
  venue_id uuid REFERENCES public.venues(id),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Option 2: Use Existing Tables with Extensions
If we want to avoid creating new tables, we could:
1. Add a `products` jsonb column to events/venues/performers tables
2. Store product data within the existing entities

## Route Changes Needed

The route needs to:
1. Fetch categories from database
2. Fetch featured products from database
3. Transform data to match UI expectations
4. Pass data as props to GearPage

Example:
```tsx
export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Fetch categories
  const { data: categories } = await client
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  // Fetch featured products
  const { data: products } = await client
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(6);
  
  // Transform to match UI expectations
  const shopCategories = categories?.map(cat => ({
    title: cat.title,
    description: cat.description,
    path: cat.path,
    image: cat.image_url
  })) || [];
  
  const featuredProducts = products?.map(product => ({
    id: product.id,
    name: product.name,
    image: product.image_url,
    price: `$${product.price.toFixed(2)}`,
    category: product.category_name,
    ...product.metadata // spread metadata for additional fields
  })) || [];
  
  return {
    shopCategories,
    featuredProducts
  };
};
```

## UI Component Changes Needed (PROBLEM!)

The GearPage component needs to:
1. Accept props for `shopCategories` and `featuredProducts`
2. Use props instead of hardcoded data

BUT YOU DON'T WANT TO MODIFY THE UI!

So we have a fundamental conflict:
- The UI has hardcoded data
- The route can fetch real data
- But the UI won't use it without modification

## The Route Problem

### Current State
Looking at `/apps/web/app/routes/gear/index.tsx`:
```tsx
export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'Gear - GoEventCity',
  };
};

export default function GearRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <GearPage />;
}
```

The route:
1. Returns only a title from the loader
2. Doesn't pass any props to `<GearPage />`
3. Just renders the GearPage component directly

### Will the Route Fix the Mock Data Issue?

**NO, the route cannot fix this issue** because:

1. **GearPage doesn't accept props** - The component definition is:
   ```tsx
   export const GearPage = () => {
   ```
   It's a zero-parameter function component.

2. **Even if the route fetches data**, it has no way to pass it to GearPage:
   ```tsx
   // This won't work - GearPage doesn't accept props
   return <GearPage shopCategories={data.shopCategories} featuredProducts={data.featuredProducts} />;
   ```

3. **The mock data is hardcoded inside the component**:
   - Lines 6-31: `const shopCategories = [{...}]`
   - Lines 33-75: `const featuredProducts = [{...}]`

### The Fundamental Conflict

The UI component (GearPage) has:
- Hardcoded mock data defined inside the component
- No props interface to accept external data
- Direct usage of the internal mock data in the render

The route could:
- Fetch real data from database
- Transform it to match expected format
- But has NO WAY to inject it into GearPage

### Example of What Would Be Needed

For the route to fix this, GearPage would need to be modified to:
```tsx
// This change is NOT ALLOWED per requirements
export const GearPage = ({ shopCategories, featuredProducts }) => {
  // Use props instead of hardcoded data
}
```

But since we cannot modify the UI, the route is powerless to fix the mock data issue.

## Possible Solutions

1. **Modify the UI Component** (Not allowed)
   - Change GearPage to accept and use props

2. **Create a Wrapper Component**
   - Keep GearPage as-is
   - Create a new component that somehow injects data

3. **Database Seeding**
   - Keep hardcoded data in UI
   - Ensure database has matching data

4. **Accept the Limitation**
   - The shop will always show mock data
   - Real functionality would require UI changes