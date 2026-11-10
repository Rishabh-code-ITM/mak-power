import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, Star, MapPin, Check, MessageCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsService } from '../services/productsService';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/common/ProductCard';
import { STORE_INFO } from '../services/mockData';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Delivery Pincode checker state
  const [pincode, setPincode] = useState('841311');
  const [pincodeResult, setPincodeResult] = useState({ checked: true, deliveryDays: 2, available: true });

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Vikram Kumar",
      rating: 5,
      date: "2 days ago",
      comment: "Super quality product! Original packing and fast charging works as promised.",
      verified: true
    },
    {
      id: 2,
      author: "Anil Sah",
      rating: 5,
      date: "1 week ago",
      comment: "Good durable finish, best price in Garkha. Very satisfied with MAK POWER service.",
      verified: true
    }
  ]);
  const [reviewForm, setReviewForm] = useState({ name: '', comment: '', rating: 5 });
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsService.getProductBySlug(slug).then(res => {
      setProduct(res);
      setActiveImageIndex(0);
      setQuantity(1);
      setLoading(false);

      if (res) {
        productsService.getProducts({ category: res.categorySlug }).then(list => {
          setRelatedProducts(list.filter(p => p.id !== res.id).slice(0, 4));
        });
      }
    });
  }, [slug]);

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>The item you are looking for might have been moved or removed.</p>
        <Link to="/shop" className="btn btn-primary">Browse All Products</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice > product.sellingPrice
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      const isLocalBihar = pincode.startsWith('84') || pincode.startsWith('80') || pincode.startsWith('85');
      setPincodeResult({
        checked: true,
        deliveryDays: isLocalBihar ? 2 : 4,
        available: true
      });
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewForm.name && reviewForm.comment) {
      setReviews(prev => [
        {
          id: Date.now(),
          author: reviewForm.name,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
          date: "Just now",
          verified: true
        },
        ...prev
      ]);
      setReviewForm({ name: '', comment: '', rating: 5 });
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 3000);
    }
  };

  const handleWhatsAppEnquire = () => {
    const text = encodeURIComponent(`Hello MAK POWER! I am interested in purchasing "${product.name}" (Price: ₹${product.sellingPrice}). Please let me know how to order.`);
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ margin: '20px 0 10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <Link to="/">Home</Link> / <Link to="/shop">Products</Link> / <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Detail Card */}
      <div className="product-detail-wrapper">
        
        {/* Gallery Column */}
        <div className="detail-gallery">
          <div className="main-preview-img-box">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="thumbnail-row">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} preview ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '20px',
            padding: '16px',
            background: 'var(--surface-alt)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <div>
              <ShieldCheck size={22} style={{ color: 'var(--primary)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>100% Genuine</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct Store Stock</div>
            </div>
            <div>
              <RefreshCw size={22} style={{ color: 'var(--primary)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>7 Days Replacement</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>If any defect</div>
            </div>
            <div>
              <Truck size={22} style={{ color: 'var(--primary)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Cash on Delivery</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pay at Doorstep</div>
            </div>
          </div>
        </div>

        {/* Product Details Column */}
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {product.categoryName}
          </span>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1.25, margin: '8px 0 12px' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '16px' }}>
            <RatingStars rating={product.rating} count={product.reviewsCount} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>|</span>
            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>
              ✓ Verified MAK POWER Quality
            </span>
          </div>

          {/* Pricing Box */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '18px 0', padding: '16px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>
              ₹{product.sellingPrice}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800 }}>
                {discountPercent}% OFF Special Deal
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Inclusive of all taxes</span>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '20px' }}>
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Qty:</span>
              <div className="qty-stepper">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className={`product-wishlist-btn ${isFavorited ? 'active' : ''}`}
              style={{ position: 'static' }}
              onClick={() => toggleWishlist(product)}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isFavorited ? 'var(--primary)' : 'none'} color={isFavorited ? 'var(--primary)' : 'currentColor'} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              <Zap size={18} />
              <span>Buy Now (COD)</span>
            </button>
          </div>

          <button
            className="btn btn-whatsapp btn-block"
            onClick={handleWhatsAppEnquire}
            style={{ marginBottom: '24px' }}
          >
            <MessageCircle size={18} />
            <span>Order / Enquire on WhatsApp</span>
          </button>

          {/* Delivery PIN Code Checker */}
          <div className="pincode-checker-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.92rem' }}>
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              <span>Delivery & Availability Check</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="pincode-input-row">
              <input
                type="text"
                className="pincode-input"
                maxLength={6}
                placeholder="Enter 6-digit PIN code (e.g. 841311)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="btn btn-dark btn-sm">
                Check
              </button>
            </form>

            {pincodeResult.checked && (
              <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                ✓ Delivery available to <strong>{pincode}</strong> in {pincodeResult.deliveryDays} business days.
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                  Cash on Delivery & Free shipping on orders above ₹499!
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section style={{ margin: '40px 0', background: '#fff', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
            Technical Specifications
          </h3>
          <table className="spec-table">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section style={{ margin: '40px 0', background: '#fff', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
          Customer Ratings & Reviews ({reviews.length})
        </h3>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
          {reviews.map(rev => (
            <div key={rev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'inline-flex', background: '#16a34a', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, alignItems: 'center', gap: '3px' }}>
                  <span>{rev.rating}</span>
                  <Star size={10} fill="#fff" />
                </div>
                <strong style={{ fontSize: '0.9rem' }}>{rev.author}</strong>
                {rev.verified && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>✓ Verified Purchase</span>}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{rev.date}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>{rev.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div style={{ background: 'var(--surface-alt)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Write a Customer Review</h4>
          
          {showReviewSuccess && (
            <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '12px', fontWeight: 600 }}>
              ✓ Thank you! Your review has been added.
            </div>
          )}

          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="text"
                placeholder="Your Name *"
                required
                value={reviewForm.name}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Below Average</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>
            <textarea
              placeholder="Write your genuine experience with this product..."
              required
              rows={3}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              Submit Review
            </button>
          </form>
        </div>

      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ margin: '40px 0' }}>
          <div className="section-heading-row">
            <div className="section-title-wrap">
              <h2>Similar & Recommended Products</h2>
              <p>Explore other accessories in this category</p>
            </div>
          </div>
          <div className="products-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
