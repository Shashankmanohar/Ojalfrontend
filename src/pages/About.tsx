import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Award,
    title: 'Craftsmanship',
    description:
      'Every piece is meticulously crafted by skilled artisans, combining traditional techniques with modern design.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description:
      'We pour our hearts into every product, ensuring each item brings joy and beauty to your table.',
  },
  {
    icon: Globe,
    title: 'Sustainability',
    description:
      'Committed to eco-friendly practices, we use sustainable materials and ethical production methods.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Building a community of design enthusiasts who appreciate the art of elegant dining.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-semibold mb-6">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground">
              OJAL was born from a simple belief: that everyday dining should be 
              an experience worth savoring. Since 2020, we've been crafting premium 
              crockery and glassware that transforms ordinary meals into extraordinary moments.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm font-medium uppercase tracking-wide">
                The Beginning
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold mt-2 mb-6">
                Where Elegance Meets Everyday
              </h2>
              <p className="text-muted-foreground mb-4">
                Founded in the heart of a small artisan village, OJAL emerged from 
                generations of ceramic craftsmanship. Our founder, inspired by the 
                delicate beauty of butterfly wings (symbolized in our logo), sought 
                to bring that same graceful elegance to the dining table.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, we collaborate with skilled artisans and modern designers to 
                create pieces that honor traditional craftsmanship while embracing 
                contemporary aesthetics. Each product in our collection tells a story 
                of dedication, creativity, and an unwavering commitment to quality.
              </p>
              <Button asChild>
                <Link to="/shop">
                  Explore Collection
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
                  alt="OJAL craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-xl max-w-xs">
                <p className="font-heading text-3xl font-semibold text-primary mb-1">4+</p>
                <p className="text-sm text-muted-foreground">
                  Years of creating beautiful dining experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide everything we create and every interaction we have.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card p-6 rounded-xl shadow-soft hover-lift"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=600"
                  alt="Ceramic crafting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-xl overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600"
                  alt="Glassware"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-primary text-sm font-medium uppercase tracking-wide">
                Our Process
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold mt-2 mb-6">
                Crafted With Care
              </h2>
              <p className="text-muted-foreground mb-4">
                Each OJAL piece goes through a rigorous creation process. From the 
                initial design sketches to the final quality inspection, we ensure 
                that every item meets our exacting standards.
              </p>
              <p className="text-muted-foreground mb-6">
                Our artisans use time-honored techniques passed down through generations, 
                combined with innovative methods that enhance durability and beauty. 
                The result is crockery and glassware that's not just functional, 
                but truly a work of art.
              </p>
              <ul className="space-y-3">
                {['Hand-selected materials', 'Artisan craftsmanship', 'Quality assurance', 'Sustainable packaging'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-charcoal text-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
            Ready to Elevate Your Table?
          </h2>
          <p className="text-background/80 mb-8 max-w-xl mx-auto">
            Discover our collection and find the perfect pieces to make every 
            meal a memorable occasion.
          </p>
          <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
