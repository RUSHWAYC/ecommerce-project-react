import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-hot-toast'

const Context = createContext()



export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct
    let index

    //When Add to Cart is pressed
    const onAdd = (product, quantity) => {
        //Go through the cart and find an item
        //(that we're adding) and match it with product that exists.
        const checkProductInCart = cartItems.find((item) => item._id === product._id)
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)
        
        //If the item exists change the total price and qty.
        if(checkProductInCart) {
            //Lastly, update the cart with all the items.
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    //Toggles the quantity of items from the cart.
    const toggleCartItemQuantity = (id, value) => {
        //Varriables created above.
        //foundProduct equals to the product found in the cart.
        foundProduct = cartItems.find((item) => item._id === id)
        //index is the ID of the found product.
        index = cartItems.findIndex((product) => product._id === id)

        if(value === 'inc') {
            setCartItems([...cartItems, { ...foundProduct,
                quantity: product.quantity + 1 }])
            setTotalPrice((prevTotalPrice) => prevTotalPrice
                + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if(value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([...cartItems, { ...foundProduct,
                    quantity: product.quantity - 1 }])
                setTotalPrice((prevTotalPrice) => prevTotalPrice
                    - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1
            return prevQty - 1
        })
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);