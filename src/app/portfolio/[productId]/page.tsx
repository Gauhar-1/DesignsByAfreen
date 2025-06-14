
import { use } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { fetchProductById, fetchProducts } from '@/lib/api'; // Import fetchProducts for generateStaticParams

type Props = {
  params: { productId: string };
};

export async function generateMetadata(
  { params: paramsFromProps }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = use(paramsFromProps); 
  const product = await fetchProductById(params.productId);
  if (!product) {
    return {
      title: 'Product Not Found - Designs by Afreen',
    };
  }
  return {
    title: `${product.name} - Designs by Afreen`,
    description: product.description || `Details for ${product.name}.`,
  };
}

export default async function ProductDetailPage({ params: paramsFromProps }: Props) {
  const params = use(paramsFromProps);
  const product = await fetchProductById(params.productId);

  if (!product) {
    return (
      <Container className="py-12 md:py-16 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/portfolio">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
       <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/portfolio">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
          <Image
            src={product.imageUrl || 'https://placehold.co/800x1000.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            data-ai-hint={product.dataAiHint || "fashion clothing detail"}
          />
        </div>
        <div>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-accent mb-6">{product.price}</p>
          
          <div className="prose prose-lg text-foreground/80 mb-8">
            <h2 className="text-xl font-headline text-primary mb-2">Description</h2>
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="mb-8 space-y-4">
            <div>
              <h3 className="text-md font-semibold text-primary mb-2">Fabric:</h3>
              <p className="text-foreground/80">Premium Silk Blend (example)</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-primary mb-2">Available Sizes:</h3>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <Button key={size} variant="outline" size="sm">{size}</Button>
                ))}
              </div>
            </div>
             <div>
              <h3 className="text-md font-semibold text-primary mb-2">Stock:</h3>
              <p className="text-foreground/80">{product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto" disabled={product.stock === 0}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    productId: product.id,
  }));
}
