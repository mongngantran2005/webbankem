import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewSummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/reviews/admin/average").then((res) => {
      setData(res.data.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">⭐ Trung bình đánh giá theo sản phẩm</h1>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sản phẩm</th>
            <th className="border p-2">Điểm trung bình</th>
            <th className="border p-2">Số lượt đánh giá</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.product_id}>
              <td className="border p-2">{item.product?.name}</td>
              <td className="border p-2 text-center">{item.average_rating}</td>
              <td className="border p-2 text-center">{item.total_reviews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
