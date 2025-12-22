import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên sản phẩm
        image: { type: String, required: true }, // Ảnh sản phẩm
        category: { type: String, required: true }, // Danh mục
        description: { type: String, required: true }, // Mô tả sản phẩm
        language: { type: String, default: 'Tiếng Việt' }, // Ngôn ngữ
        
        price: { type: Number, required: true, default: 0 },
        
        //trường tồn kho
        countInStock: { type: Number, required: true, default: 0 },
        
        // SEO
        metaTitle: { type: String },
        metaDescription: { type: String },
        metaKeywords: { type: String },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;