import React from 'react';

interface OrderStats {
  newOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  canceledOrders: number;
  cancelReasons: { reason: string; count: number }[];
  bestSellingProducts: { productName: string; quantitySold: number }[];
}

const OrderStatistics: React.FC<{ stats: OrderStats }> = ({ stats }) => {
  const totalOrders =
    stats.newOrders +
    stats.processingOrders +
    stats.deliveredOrders +
    stats.canceledOrders;

  const cancelRate =
    totalOrders > 0 ? (stats.canceledOrders / totalOrders) * 100 : 0;

  return (
    <div>
          <h1>Thống kê đơn hàng</h1>
          <section>
              <h2>Tổng số đơn hàng</h2>
              <p>{totalOrders}</p>
          </section><section>
              <h2>Số lượng đơn hàng theo trạng thái</h2>
              <ul>
                  <li>Đơn mới: {stats.newOrders}</li>
                  <li>Đang xử lý: {stats.processingOrders}</li>
                  <li>Đã giao: {stats.deliveredOrders}</li>
                  <li>Bị hủy: {stats.canceledOrders}</li>
              </ul>
          </section><section>
              <h2>Tỷ lệ đơn hàng bị hủy</h2>
              <p>{cancelRate.toFixed(2)}%</p>
              <h3>Lý do hủy</h3>
              <ul>
                  {stats.cancelReasons.map((reason, index) => (
                      <li key={index}>
                          {reason.reason}: {reason.count}
                      </li>
                  ))}
              </ul>
          </section><section>
              <h2>Sản phẩm bán chạy nhất</h2>
              <ul>
                  {stats.bestSellingProducts.map((product, index) => (
                      <li key={index}>
                          {product.productName}: {product.quantitySold} sản phẩm
                      </li>
                  ))}
              </ul>
            </section>
        </div>
    );
};

export default OrderStatistics;