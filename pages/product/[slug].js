import { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutline, Star, AiOutlineStar} from 'react-icons/ai'
import { Product } from '../../components'

import { client, urlFor } from '../../lib/client'
import { useStateContext } from '../../context/StateContext'


//Props (client data) received from getStaticProps at the bottom.
const ProductDetails = ({ product, products }) => {

    const { image, name, details, price } = product
    const [index, setIndex] = useState(0)

    //Use state context from ../../context/StateContext
    const { decQty, incQty, qty, onAdd } = useStateContext()

  return (
    <div>
       <div className='product-detail-container'>
            <div>
                <div className='image-container'>
                    <img src={urlFor(image && image[index])}
                        className='product-detail-image'
                    />
                </div>
                {/* Small images beneath the main image. */}
                <div className='small-images-container'>
                    {image?.map((item, i) => (
                        <img
                        key={i}
                         src={urlFor(item)}
                         className={i === index ? 'small-image selected-image' : 'small-image'}
                         //onMouseEnter replace the mainimage with hovered one
                         //and apply classes above.
                         onMouseEnter={() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>
            <div className='product-detail-desc'>
                <h1>{name}</h1>
                <div className='reviews'>
                    <div>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                    </div>
                    <p>(20)</p>
                </div>
                <h4>Details: </h4>
                <p>{details}</p>
                <p className='price'>${price}</p>
                <div className='quantity'>
                    <h3>Quanitity: </h3>
                    <p className='quantity-desc'>
                        <span className='minus'
                        onClick={decQty}><AiOutlineMinus /></span>
                        <span className='num'
                        onClick=''>{qty}</span>
                        <span className='plus'
                        onClick={incQty}><AiOutlinePlus /></span>
                    </p>
                </div>
                <div className='buttons'>
                    <button type='button'
                            className='add-to-cart'
                            onClick={() => onAdd(product, qty)}
                    >
                        Add to Cart
                    </button>
                    <button type='button'
                            className='buy-now'
                            onClick=''
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div> 
        <div className='maylike-products-wrapper'>
            <h2>You may also like</h2>
            <div className='marquee'>
                <div className='maylike-products-container track'>
                    {products.map((item) => (
                        <Product key={item._id} product={item}/>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}


//If you enter a pre-loaded page that contains more pre-loaded
//pages, gotta set up getStaticPaths for them.
export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`
    const products = await client.fetch(query)
    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}


//getStaticProps pre-load the pages when users enters the site.
export const getStaticProps = async ({ params: { slug } }) => {
    //Get the product info of the first product that matches the slug.
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`
    //Get all products. Will be used for recommended items.
    const productQuery = '*[_type == "product"]'
    //Get the queried single product.
    const product = await client.fetch(query);
    //Get the queried all products.
    const products = await client.fetch(productQuery);
  
    return {
      props: { product, products }
    }
  }

export default ProductDetails