'use client'
import React from 'react'
import styles from './OrderOverview.module.scss'
import BadgeOrderCanceled from './StatusBadge/BadgeOrderCanceled/BadgeOrderCanceled'
import ReviewOrderModal from './ReviewOrderModal/ReviewOrderModal'
import BadgeOrderPaid from './StatusBadge/BadgeOrderCompleted/BadgeOrderCompleted'
import useAPIUserOrder from '@/lib/hooks/api/useAPIUserOrder'
import { useConfirm } from 'material-ui-confirm'
import { KeyedMutator } from 'swr'
import { toast } from 'react-toastify'
import OrderStatus from '@/enum/OrderStatus'
import BadgeOrderCompleted from './StatusBadge/BadgeOrderCompleted/BadgeOrderCompleted'
import BadgeOrderDelivering from './StatusBadge/BadgeOrderDelivering/BadgeOrderDelivering'
import BadgeOrderConfirm from './StatusBadge/BadgeOrderConfirm/BadgeOrderConfirm'
import BadgeOrderPending from './StatusBadge/BadgeOrderPeding/BadgeOrderPeding'

interface IOrderOverviewProps {
    data: IOrder
    mutate: KeyedMutator<any>
}
const OrderOverview = (props: IOrderOverviewProps) => {
    const { data, mutate } = props
    const { cancelOrder, completeOrder } = useAPIUserOrder()
    const confirm = useConfirm()

    const handleCancelOrder = async (id: number) => {
        confirm({
            title: `Đồng ý hủy đơn hàng ${id} ?`,
            description: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        })
            .then(async () => {
                try {
                    await cancelOrder(id)
                    mutate()
                    toast.success("Hủy đơn hàng hoàn tất id: " + id)
                }
                catch (e) {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại")
                }
            })
    }

    const handleCompleteOrder = async (id: number) => {
        confirm({
            title: `Xác nhận đã nhận đơn hàng ${id} ?`,
            description: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        })
            .then(async () => {
                try {
                    await completeOrder(id)
                    mutate()
                    toast.success("Xác nhận đơn hàng hoàn tất id: " + id)
                }
                catch (e) {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại")
                }
            })
    }

    return (
        <>
            <div className={`card mb-2 py-3 px-4 ${styles.orderViewContentInfo}`}>
                <div className={styles.orderViewTitle}>
                    Chi tiết đơn hàng
                </div>
                <div>
                    {
                        data.status === OrderStatus.COMPLETED
                            ? <BadgeOrderCompleted />
                            : data.status === OrderStatus.CONFIRMED
                                ? <BadgeOrderConfirm /> :
                                data.status === OrderStatus.DELIVERING
                                    ? <BadgeOrderDelivering /> :
                                    data.status === OrderStatus.PENDING
                                        ? <BadgeOrderPending /> :
                                        data.status === OrderStatus.CANCELED
                                            ? <BadgeOrderCanceled /> :
                                            <></>
                    }
                    <div className={styles.orderViewId}>
                        <span>
                            Mã đơn hàng:
                        </span>
                        <span>
                            {data.id}
                        </span>
                    </div>
                    <div className={styles.orderViewId}>
                        <span>
                            Thanh toán:
                        </span>
                        <span>
                            {data.payment_status}
                        </span>
                    </div>
                    <div className={styles.orderViewDate}>
                        <span>
                            Ngày mua:
                        </span>
                        <span>
                            20/11/2023
                        </span>
                    </div>
                    <div className={styles.orderViewTotal}>
                        <span>
                            Tổng Tiền:
                        </span>
                        <span className={styles.price}>
                            {data.final_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                    </div>
                    <div className={styles.orderViewNote}>
                        <span className={styles.noteTitle}>
                            Ghi chú:
                        </span>
                        <span className={styles.noteContent}>

                            {data.customer_note ? (
                                <>
                                    {data.customer_note}
                                </>
                            ) : (
                                <>
                                    (Không có)
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles.overviewBtns}>
                    {/* delivering  */}
                    {data.status === OrderStatus.DELIVERING && (
                        <button
                            className={styles.orderReceivedBtn}
                            onClick={() => handleCompleteOrder(data.id)}
                        >
                            Xác nhận đã nhận hàng
                        </button>
                    )}
                    {/* pedding , cofirm  */}
                    {
                        (data.status === OrderStatus.CONFIRMED || data.status === OrderStatus.PENDING)
                        &&
                        <button
                            className={styles.orderReceivedBtn}
                            onClick={() => handleCancelOrder(data.id)}
                        >
                            Huỷ bỏ đơn hàng
                        </button>
                    }
                    {/* completed  */}
                    {data.status === OrderStatus.COMPLETED && !data.review &&
                        (
                            <ReviewOrderModal orderId={data.id} />
                        )
                    }
                </div>
            </div >
            <div className="card mb-2 py-3 px-4">
                <div className={styles.orderViewContentBox}>
                    <div className={styles.orderViewBox}>
                        <div className={styles.orderBoxTitle}>
                            <div className={styles.orderViewTitle}>
                                Thông tin người nhận
                            </div>
                        </div>
                        <div className={styles.orderBoxInfo}>
                            <address>
                                {data.userAddress?.recipient_name}
                                <br />
                                {data.userAddress?.street}<br />
                                {data.userAddress?.wards.name}, {data.userAddress?.wards.district.name},  {data.userAddress?.wards.district.province.name}< br />
                                Tel: {data.userAddress?.recipient_phone}
                            </address>
                        </div>
                    </div>
                    <div className={styles.orderViewBox}>
                        <div className={styles.orderShippingDesc}>
                            <div className={styles.orderViewTitle}>
                                Phương thức vận chuyển
                            </div>
                        </div>
                        <div className={styles.orderBoxInfo}>
                            Giao hàng tiêu chuẩn
                        </div>
                    </div>
                    <div className={styles.orderViewBox}>
                        <div className={styles.orderBoxTitle}>
                            <div className={styles.orderViewTitle}>
                                Phương thức thanh toán
                            </div>
                        </div>
                        <div className={styles.orderBoxInfo}>
                            {data.payment_method}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderOverview
