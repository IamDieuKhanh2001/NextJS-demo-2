"use client"
import ProductImgSlider from '@/components/product/ProductDetail/ProductImgSlider/ProductImgSlider'
import React, { useEffect, useState } from 'react'
import styles from './ProductDetail.module.scss'
import ProductTab from './ProductTab/ProductTab'
import FlashSaleCountDown from './FlashSaleCountDown/FlashSaleCountDown'
import useAPIGuest from '@/lib/hooks/api/useAPIGuest'
import { useRouter } from 'next/navigation'

interface IProductDetailProps {
    isbnCode: string
}
const ProductDetail = (props: IProductDetailProps) => {
    const router = useRouter()
    const { isbnCode } = props
    const { getBookDetail } = useAPIGuest()
    const { data: product, error } = getBookDetail(isbnCode)
    const [quantity, setQuantity] = useState(1)
    const initialHours = 5; // Số giờ ban đầu
    const initialMinutes = 30; // Số phút ban đầu

    const handleIncreaseQuantity = () => {
        setQuantity((quantity) => (quantity + 1))
    }

    const handleDecreaseQuantity = () => {
        setQuantity((quantity) => (quantity - 1))
    }

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10);
        if (!isNaN(newValue) && newValue >= 1) {
            setQuantity(newValue);
        }
    };

    useEffect(() => {
        if (error)
            router.push('/404')
    }, [error])

    return (
        <>
            <div className="container-xxl py-3 mt-2 section-container">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 wow fadeIn" data-wow-delay="0.1s">
                            <div className="about-img position-relative overflow-hidden p-lg-5 pe-0">
                                <ProductImgSlider imgList={product.images} />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 wow fadeIn" data-wow-delay="0.5s">
                            <h3 className="mb-2">{product?.name}</h3>
                            <div className="d-flex mb-1">
                                <div className="text-primary me-2">
                                    <small className="fas fa-star" />
                                    <small className="fas fa-star" />
                                    <small className="fas fa-star" />
                                    <small className="fas fa-star-half-alt" />
                                    <small className="far fa-star" />
                                </div>
                                <small className="pt-1">(99 Reviews)</small>
                            </div>
                            <FlashSaleCountDown
                                initialHours={initialHours}
                                initialMinutes={initialMinutes}
                                numProductSold={4}
                                numProductTotal={10}
                            />
                            <h2>
                                {/* <span className="text-body text-decoration-line-through me-2">30.000</span> */}
                                <span className="text-primary me-1">
                                    {product.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </span>
                            </h2>
                            <p><i className="fa fa-check text-primary me-3" />Đổi trả trong vòng 7 ngày</p>
                            <p><i className="fa fa-check text-primary me-3" />Cam kết sản phẩm chính hãng</p>
                            <p><i className="fa fa-check text-primary me-3" />Vận chuyển trên toàn quốc</p>

                            <div className={`input-group ${styles.qtyContainer}`}>
                                <div className="input-group-btn">
                                    <button
                                        className="btn btn-primary btn-minus"
                                        onClick={handleDecreaseQuantity}
                                    >
                                        <i className="fa fa-minus" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="form-control bg-light border-1 text-center"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <div className="input-group-btn">
                                    <button
                                        className="btn btn-primary btn-plus"
                                        onClick={handleIncreaseQuantity}
                                    >
                                        <i className="fa fa-plus" />
                                    </button>
                                </div>
                            </div>

                            <a className="btn btn-primary rounded-pill py-3 px-5 mt-3" href="">
                                <i className="fas fa-cart-plus me-3" />
                                Thêm vào giỏ hàng
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-xxl py-3 mt-2 section-container">
                <ProductTab product={product} />
            </div>
            {/* About End */}
        </>
    )
}

export default ProductDetail
