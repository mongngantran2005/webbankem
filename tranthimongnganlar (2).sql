-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 08, 2025 lúc 12:12 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `tranthimongnganlar`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_banner`
--

CREATE TABLE `ttmn_banner` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(1000) NOT NULL,
  `image` varchar(1000) NOT NULL,
  `link` varchar(1000) DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `position` enum('slideshow','ads') NOT NULL DEFAULT 'slideshow',
  `description` tinytext DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_banner`
--

INSERT INTO `ttmn_banner` (`id`, `name`, `image`, `link`, `sort_order`, `position`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 'Slider 1', 'slider-1.webp', NULL, 1, 'slideshow', 'Mô tả', 1, 2, '2025-04-25 00:12:01', '2025-05-08 01:23:35', NULL, 1),
(2, 'Slider 2', 'slider-2.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(3, 'Slider 3', 'slider-3.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(4, 'Slider 4', 'slider-4.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(5, 'Slider 5', 'slider-5.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(6, 'Slider 6', 'slider-6.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(7, 'Slider 7', 'slider-7.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(8, 'Slider 8', 'slider-8.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(9, 'Slider 9', 'slider-9.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(10, 'Slider 10', 'slider-10.webp', NULL, 1, 'slideshow', 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_brand`
--

CREATE TABLE `ttmn_brand` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(1000) NOT NULL,
  `slug` varchar(1000) NOT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_brand`
--

INSERT INTO `ttmn_brand` (`id`, `name`, `slug`, `image`, `sort_order`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 'Thương hiệu 1', 'thuong-hieu-1', 'thuong-hieu-1.jpg', 1, 'Mô tả thương hiệu', 1, 1, '2025-04-25 00:12:01', '2025-05-09 07:03:08', NULL, 1),
(2, 'Thương hiệu 2', 'thuong-hieu-2', 'thuong-hieu-2.webp', 2, 'Mô tả thương hiệu', 1, 1, '2025-04-25 00:12:01', '2025-05-09 06:56:35', NULL, 1),
(3, 'Thương hiệu 3', 'thuong-hieu-3', 'thuong-hieu-3.webp', 3, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(4, 'Thương hiệu 4', 'thuong-hieu-4', 'thuong-hieu-4.webp', 4, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(5, 'Thương hiệu 5', 'thuong-hieu-5', 'thuong-hieu-5.webp', 5, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(6, 'Thương hiệu 6', 'thuong-hieu-6', 'thuong-hieu-6.webp', 6, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(7, 'Thương hiệu 7', 'thuong-hieu-7', 'thuong-hieu-7.webp', 7, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(8, 'Thương hiệu 8', 'thuong-hieu-8', 'thuong-hieu-8.webp', 8, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(9, 'Thương hiệu 9', 'thuong-hieu-9', 'thuong-hieu-9.webp', 9, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(10, 'Thương hiệu 10', 'thuong-hieu-10', 'thuong-hieu-10.webp', 10, 'Mô tả thương hiệu', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(12, 'đăng kí ă', 'dang-ki-a', NULL, 0, 'lllkkk', 1, NULL, '2025-05-09 07:14:19', '2025-05-09 07:14:31', '2025-05-09 07:14:31', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_category`
--

CREATE TABLE `ttmn_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(1000) NOT NULL,
  `slug` varchar(1000) NOT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `parent_id` int(10) UNSIGNED NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_category`
--

INSERT INTO `ttmn_category` (`id`, `name`, `slug`, `image`, `parent_id`, `sort_order`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 'Kem Que', 'kem-que', '1746700058-kem-socola.jpg', 0, 0, 'kem-que', 1, 1, '2025-04-25 00:12:01', '2025-05-09 05:02:07', NULL, 1),
(2, 'Kem Ly', 'kem-ly', 'danh-muc-2.webp', 0, 0, 'Mô tả', 1, 1, '2025-04-25 00:12:01', '2025-04-25 01:43:21', NULL, 1),
(3, 'Kem Nhập Khẩu', 'kem-nhap-khau', 'danh-muc-3.webp', 0, 0, 'Mô tả', 1, 1, '2025-04-25 00:12:01', '2025-04-25 01:43:33', NULL, 1),
(4, 'Danh mục 4', 'danh-muc- 4', 'danh-muc-4.webp', 0, 4, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(5, 'Danh mục 5', 'danh-muc- 5', 'danh-muc-5.webp', 0, 5, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(6, 'Danh mục 6', 'danh-muc- 6', 'danh-muc-6.webp', 0, 6, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(7, 'Danh mục 7', 'danh-muc- 7', 'danh-muc-7.webp', 0, 7, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(8, 'Danh mục 8', 'danh-muc- 8', 'danh-muc-8.webp', 0, 8, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(9, 'Danh mục 9', 'danh-muc- 9', 'danh-muc-9.webp', 0, 9, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(10, 'Danh mục 10', 'danh-muc- 10', 'danh-muc-10.webp', 0, 10, 'Mô tả', 1, NULL, '2025-04-25 00:12:01', NULL, NULL, 1),
(14, 'dfdju', 'dfdju', '1746792139-kem-dau.jpg', 1, 0, 'gvbj', 1, NULL, '2025-05-09 05:02:19', '2025-05-09 05:02:19', NULL, 1),
(15, 'address', 'address', '', 4, 0, 'kkkkkk', 1, NULL, '2025-05-09 07:13:30', '2025-05-09 07:13:56', '2025-05-09 07:13:56', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_menu`
--

CREATE TABLE `ttmn_menu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(1000) NOT NULL,
  `link` varchar(1000) NOT NULL,
  `table_id` int(10) UNSIGNED DEFAULT NULL,
  `parent_id` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `type` enum('category','brand','page','topic','custom') NOT NULL DEFAULT 'custom',
  `position` enum('mainmenu','footer') NOT NULL DEFAULT 'mainmenu',
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_menu`
--

INSERT INTO `ttmn_menu` (`id`, `name`, `link`, `table_id`, `parent_id`, `sort_order`, `type`, `position`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 'Trang Chủ', '/', NULL, 0, 0, 'custom', 'mainmenu', 0, 1, NULL, '2025-04-25 03:03:14', NULL, 1),
(2, 'Giới Thiệu', '/gioi-thieu', NULL, 0, 0, 'custom', 'mainmenu', 0, NULL, NULL, NULL, NULL, 1),
(3, 'Sản Phẩm', '/san-pham', NULL, 0, 0, 'custom', 'mainmenu', 0, NULL, NULL, NULL, NULL, 1),
(4, 'Liên Hệ', '/lien-he', NULL, 0, 0, 'custom', 'mainmenu', 0, 1, NULL, '2025-05-09 06:46:34', NULL, 1),
(5, 'Bài Viết', '/bai-viet', NULL, 0, 0, 'custom', 'mainmenu', 0, NULL, NULL, NULL, NULL, 1),
(6, 'Kem Que', 'kem-que', NULL, 3, 0, 'custom', 'mainmenu', 0, NULL, NULL, NULL, NULL, 0),
(7, 'Kem Ly', 'kem-ly', NULL, 3, 0, 'custom', 'mainmenu', 0, NULL, NULL, NULL, NULL, 0),
(8, 'kem Nhập Khẩu', 'kem-nhap-khau', NULL, 3, 0, 'custom', 'mainmenu', 0, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_migrations`
--

CREATE TABLE `ttmn_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_migrations`
--

INSERT INTO `ttmn_migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_03_13_020237_create_banner_table', 1),
(2, '2025_03_13_041454_create_category_table', 1),
(3, '2025_03_13_041504_create_brand_table', 1),
(4, '2025_03_13_041514_create_product_table', 1),
(5, '2025_03_13_041528_create_post_table', 1),
(6, '2025_03_13_041538_create_topic_table', 1),
(7, '2025_03_13_041548_create_menu_table', 1),
(8, '2025_03_13_041558_create_contact_table', 1),
(9, '2025_03_13_041609_create_user_table', 1),
(10, '2025_03_13_041646_create_order_table', 1),
(11, '2025_03_13_041655_create_orderdetail_table', 1),
(12, '2025_04_12_132839_update_sort_order_default_in_brand_table', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_order`
--

CREATE TABLE `ttmn_order` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `note` text DEFAULT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_order`
--

INSERT INTO `ttmn_order` (`id`, `user_id`, `name`, `phone`, `email`, `address`, `note`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(3, 2, 'kem que dâu', '12345674112', 'example@gmail.com', 'long an', '', NULL, '2025-05-08 01:45:08', '2025-05-09 12:34:09', NULL, 1),
(5, 1, 'xcdh', '5', 'example@gmail.com', 'long an', '', NULL, '2025-05-09 23:09:46', '2025-05-09 23:09:46', NULL, 1),
(6, 1, 'adminlar', '02132123789', 'example@gmail.com', 'long an', '', NULL, '2025-05-09 23:33:35', '2025-05-09 23:33:35', NULL, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_orderdetail`
--

CREATE TABLE `ttmn_orderdetail` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `price_buy` double NOT NULL,
  `qty` int(10) UNSIGNED NOT NULL,
  `amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_orderdetail`
--

INSERT INTO `ttmn_orderdetail` (`id`, `order_id`, `product_id`, `price_buy`, `qty`, `amount`) VALUES
(1, 1, 9, 205000, 2, 410000),
(2, 2, 11, 9000, 1, 9000),
(3, 3, 10, 319000, 2, 638000),
(4, 4, 3, 9000, 1, 9000),
(5, 5, 3, 9000, 1, 9000),
(6, 6, 9, 205000, 2, 410000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_post`
--

CREATE TABLE `ttmn_post` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `topic_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(1000) NOT NULL,
  `slug` varchar(1000) NOT NULL,
  `detail` mediumtext NOT NULL,
  `thumbnail` varchar(1000) DEFAULT NULL,
  `type` enum('post','page') NOT NULL DEFAULT 'post',
  `description` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_post`
--

INSERT INTO `ttmn_post` (`id`, `topic_id`, `title`, `slug`, `detail`, `thumbnail`, `type`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 1, 'Cách Làm Kem Tươi Tại Nhà Cực Dễ gvj', 'cach-lam-kem-tuoi-tai-nha', 'Chỉ cần vài nguyên liệu đơn giản như kem sữa, sữa đặc và hương liệu, bạn có thể tự tay làm món kem tươi mát lạnh tại nhà. Thưởng thức ngay sau bữa ăn nhé!', '1746859467-portfolio-3.jpg', 'post', 'Hướng dẫn làm kem trái cây tươi tại nhà – món ngon cho cả gia đình.', 0, 1, NULL, '2025-05-09 23:44:27', NULL, 1),
(2, 1, 'Top 5 Loại Kem Bán Chạy Nhất Mùa Hè 2025', ' top-5-kem-mua-he', 'Danh sách những loại kem được yêu thích nhất mùa hè năm nay gồm có: kem xoài dừa, kem dâu tây, kem matcha, kem sô cô la và kem chanh dây.', '1746861257-product-4.jpg', 'post', 'Danh sách những loại kem được yêu thích nhất mùa hè năm nay gồm có: kem xoài dừa, kem dâu tây, kem matcha, kem sô cô la và kem chanh dây.', 0, 1, NULL, '2025-05-10 00:14:17', NULL, 1),
(3, 4, 'Lợi Ích Bất Ngờ Từ Việc Ăn Kem', 'loi-ich-an-kem', 'Kem không chỉ ngon mà còn giúp cải thiện tâm trạng, bổ sung năng lượng tức thì và đôi khi còn chứa các chất dinh dưỡng có lợi từ sữa.', '1746861269-service-4.jpg', 'post', 'Những lợi ích không ngờ từ món ăn vặt yêu thích – kem!', 0, 1, NULL, '2025-05-10 00:14:29', NULL, 1),
(4, 1, 'Review Kem Ý Gelato – Mịn Mà & Thơm Ngon', 'review-kem-y-gelato', 'Gelato nổi bật với vị kem đậm đà, ít béo hơn kem thông thường. Nếu bạn yêu thích ẩm thực Ý, đây là món không thể bỏ qua.', '1746861278-product-1.jpg', 'post', 'Trải nghiệm vị ngon mịn màng của kem Gelato trứ danh nước Ý.', 0, 1, NULL, '2025-05-10 00:14:38', NULL, 1),
(5, 4, 'Kem Ăn Kiêng – Có Thật Sự Tốt Cho Người Giảm Cân?', 'kem-an-kieng-co-tot-khong', 'Các loại kem ít đường, ít calo đang rất được ưa chuộng. Tuy nhiên, cần cân nhắc kỹ thành phần trước khi sử dụng thường xuyên.', '1746860488-portfolio-5.jpg', 'post', 'Tìm hiểu về kem ăn kiêng và mức độ phù hợp với người đang giảm cân.', 0, 1, NULL, '2025-05-10 00:01:28', NULL, 1),
(6, 1, 'Tự Làm Kem Trái Cây Tươi – Vừa Ngon Vừa Bổ', ' tu-lam-kem-trai-cay-tuoi', 'Kem trái cây tươi là sự kết hợp giữa sữa chua, trái cây xay và mật ong. Bạn có thể biến tấu theo khẩu vị cá nhân và dùng ngay khi đông đá.', '1746860472-carousel-1.jpg', 'post', 'Hướng dẫn làm kem trái cây tươi tại nhà – món ngon cho cả gia đình.', 0, 1, NULL, '2025-05-10 00:01:12', NULL, 1),
(11, 1, 'fhddcfhd', 'fhddcfhd', '', NULL, 'post', 'ghk', 1, 1, '2025-05-09 09:13:01', '2025-05-09 09:15:41', '2025-05-09 09:15:41', 1),
(12, 1, 'ccc', 'ccc', '', NULL, 'post', 'xsdfgtyuiop', 1, NULL, '2025-05-09 11:29:56', '2025-05-09 11:30:01', '2025-05-09 11:30:01', 1),
(13, 1, 'hỏi đáp', 'hoi-dap', '', '1746860936-portfolio-1.jpg', 'post', 'fcnj', 1, NULL, '2025-05-10 00:08:56', '2025-05-10 01:24:41', '2025-05-10 01:24:41', 1),
(14, 1, 'dfhd', 'dfhd', '', '1746864555-service-1.jpg', 'post', 'cgnj', 1, NULL, '2025-05-10 01:09:15', '2025-05-10 01:24:38', '2025-05-10 01:24:38', 1),
(15, 1, 'them bai viet mo', 'them-bai-viet-mo', 'chi tite', '1746864937-portfolio-5.jpg', 'post', 'mo ta ngan', 1, NULL, '2025-05-10 01:15:37', '2025-05-10 01:24:36', '2025-05-10 01:24:36', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_product`
--

CREATE TABLE `ttmn_product` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `brand_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(1000) NOT NULL,
  `slug` varchar(1000) NOT NULL,
  `price_root` double NOT NULL,
  `price_sale` double NOT NULL,
  `thumbnail` varchar(1000) DEFAULT NULL,
  `qty` int(10) UNSIGNED NOT NULL,
  `detail` longtext DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_product`
--

INSERT INTO `ttmn_product` (`id`, `category_id`, `brand_id`, `name`, `slug`, `price_root`, `price_sale`, `thumbnail`, `qty`, `detail`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 1, 1, 'Kem Que Dâu', 'kem-que-dau', 25000, 20000, 'kem-que-dau.png', 15, 'Kem Que Dâu', 'Kem Que Dâu', 1, NULL, '2025-04-25 00:25:55', '2025-04-25 00:25:55', NULL, 1),
(2, 1, 1, 'Kem Que Đậu Xanh', 'kem-que-dau-xanh', 27000, 17000, 'kem-que-dau-xanh.jpg', 26, 'Kem Que Đậu Xanh', 'Kem Que Đậu Xanh', 1, NULL, '2025-04-25 00:26:56', '2025-04-25 00:26:56', NULL, 1),
(3, 1, 1, 'Kem Que Socola', 'kem-que-socola', 19000, 9000, 'kem-que-socola.jpg', 27, 'Kem Que Socola', 'Kem Que Socola', 1, NULL, '2025-04-25 00:27:42', '2025-04-25 00:27:42', NULL, 1),
(4, 1, 1, 'Kem Que Dừa', 'kem-que-dua', 23000, 12000, 'kem-que-dua.jpg', 23, 'Kem Que Dừa', 'Kem Que Dừa', 1, NULL, '2025-04-25 00:28:50', '2025-04-25 00:28:50', NULL, 1),
(5, 1, 1, 'Kem Que Sầu Riêng', 'kem-que-sau-rieng', 36000, 31000, 'kem-que-sau-rieng.jpg', 15, 'Kem Que Sầu Riêng', 'Kem Que Sầu Riêng', 1, NULL, '2025-04-25 00:29:38', '2025-04-25 00:29:38', NULL, 1),
(6, 1, 1, 'Kem Que Matcha', 'kem-que-matcha', 19000, 11000, 'kem-que-matcha.jpg', 13, 'Kem Que Matcha', 'Kem Que Matcha', 1, NULL, '2025-04-25 00:30:47', '2025-04-25 00:30:47', NULL, 1),
(7, 2, 2, 'Kem Ly 3 Viên Sầu Riêng', 'kem-ly-3-vien-sau-rieng', 145000, 125000, 'kem-ly-3-vien-sau-rieng.jpg', 13, 'Kem Ly 3 Viên Sầu Riêng', 'Kem Ly 3 Viên Sầu Riêng', 1, NULL, '2025-04-25 00:32:07', '2025-04-25 00:32:07', NULL, 1),
(8, 2, 2, 'Kem ly vàng thập cẩm', 'kem-ly-vang-thap-cam', 129000, 109000, 'kem-ly-vang-thap-cam.png', 16, 'Kem ly vàng thập cẩm', 'Kem ly vàng thập cẩm', 1, NULL, '2025-04-25 00:33:03', '2025-04-25 00:33:03', NULL, 1),
(9, 3, 3, 'Kem Gelato - Ý', 'kem-gelato-y', 225000, 205000, 'kem-gelato-y.jpg', 21, 'Gelato là dòng kem trứ danh đến từ nước Ý, nổi bật với kết cấu mịn mượt, đậm đà hương vị và ít béo hơn so với kem truyền thống', 'Gelato là dòng kem trứ danh đến từ nước Ý, nổi bật với kết cấu mịn mượt, đậm đà hương vị và ít béo hơn so với kem truyền thống', 1, NULL, '2025-04-25 00:34:28', '2025-04-25 00:34:28', NULL, 1),
(10, 3, 3, 'Fanny: kem truyền thống của nước Pháp', 'fanny-kem-truyen-thong-cua-nuoc-phap', 325000, 319000, 'fanny-kem-truyen-thong-cua-nuoc-phap.jpg', 24, 'Fanny: kem truyền thống của nước Pháp', 'Fanny: kem truyền thống của nước Pháp', 1, NULL, '2025-04-25 00:35:45', '2025-04-25 00:35:45', NULL, 1),
(11, 2, 4, 'Matcha Latte Tổng Tài Võ Tấn Phát', 'matcha-latte-tong-tai-vo-tan-phat', 59000, 9000, 'matcha-latte-vo-tan-phat.jpg', 23, 'Matcha Latte Tổng Tài Võ Tấn Phát', 'Matcha Latte Tổng Tài Võ Tấn Phát', 1, 1, '2025-04-25 07:46:19', '2025-04-25 07:49:36', NULL, 1),
(14, 3, 1, 'thêm sản phẩm 1', 'them-san-pham-1', 100, 10, 'them-san-pham-1.jpg', 1, 'cfhfgc', 'fch', 1, NULL, '2025-05-08 03:18:48', '2025-05-08 03:18:48', NULL, 1),
(15, 1, 2, 'đăng kí ă', 'dang-ki-a', 100, 10, 'dang-ki-a.jpg', 1, 'cfhfdf', 'fcnhd', 1, NULL, '2025-05-10 01:31:57', '2025-05-10 01:32:07', '2025-05-10 01:32:07', 1),
(16, 2, 1, 'hkmvfvcn', 'hkmvfvcn', 100, 11, 'hkmvfvcn.jpg', 1, 'vcfjcv', 'fgjcvn', 1, 1, '2025-05-10 04:01:37', '2025-05-10 04:01:58', '2025-05-10 04:01:58', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_topic`
--

CREATE TABLE `ttmn_topic` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(1000) NOT NULL,
  `slug` varchar(1000) NOT NULL,
  `description` tinytext DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_topic`
--

INSERT INTO `ttmn_topic` (`id`, `name`, `slug`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 'Ẩm thực & công thức', 'am-thuc-cong-thuc', 'Cách làm kem tại nhà (kem tươi, kem que, kem sữa dừa, kem không cần máy…)\r\n\r\nNhững hương vị kem độc đáo trên thế giới\r\n\r\nCác công thức kem chay hoặc không chứa đường cho người ăn kiêng\r\n\r\nSo sánh các lo', 0, 1, NULL, '2025-05-09 06:49:08', NULL, 1),
(2, 'Văn hóa & lịch sử', 'van-hoa-lich-su', 'Lịch sử ra đời của kem\r\n\r\nVăn hóa ăn kem ở các nước (Mỹ, Ý, Nhật, Việt Nam…)\r\n\r\nNhững lễ hội kem nổi tiếng', 0, NULL, NULL, NULL, NULL, 1),
(3, 'Du lịch & địa điểm', 'du-lich-va-dia-diem', 'Review quán kem nổi tiếng\r\n\r\nNhững nơi bán kem ngon ở Sài Gòn, Hà Nội, Đà Nẵng...\r\n\r\nTrải nghiệm thử kem ở nước ngoài', 0, NULL, NULL, NULL, NULL, 1),
(4, 'Sức khỏe & dinh dưỡng', 'sua-khoe-va-dinh-duong', 'Kem có tốt cho sức khỏe không?\r\n\r\nCác loại kem dành cho người tiểu đường, ăn kiêng\r\n\r\nLợi ích và tác hại khi ăn quá nhiều kem', 0, NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_ttmn_contact`
--

CREATE TABLE `ttmn_ttmn_contact` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `title` varchar(1000) NOT NULL,
  `content` mediumtext NOT NULL,
  `reply_id` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_by` int(10) UNSIGNED NOT NULL,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `reply_content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_ttmn_contact`
--

INSERT INTO `ttmn_ttmn_contact` (`id`, `user_id`, `name`, `email`, `phone`, `title`, `content`, `reply_id`, `created_by`, `updated_by`, `deleted_at`, `created_at`, `updated_at`, `status`, `reply_content`) VALUES
(2, NULL, 'ds', 'dau@gmail.com', '1236985475', 'hỏi đáp', 'xfdhy', 1, 1, NULL, '2025-05-10 04:05:54', '2025-05-09 06:47:11', '2025-05-10 04:05:54', 0, 'fxgh'),
(3, NULL, 'kem que dâu', 'dau@gmail.com', '1234567412', 'bai viet them', 'khjkhk', 0, 1, NULL, NULL, '2025-05-09 11:16:29', '2025-05-09 11:16:29', 0, NULL),
(4, NULL, 'thành viên 11', 'vien@gmail.com', 'vbgh', 'xcdh', 'drhuy', 0, 1, NULL, NULL, '2025-05-09 12:22:02', '2025-05-09 12:22:02', 0, NULL),
(5, NULL, 'thành viên 111', 'vien1@gmail.com', 'vbgh', 'xcdh', 'drhuy', 0, 1, NULL, NULL, '2025-05-09 12:24:55', '2025-05-10 01:44:49', 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ttmn_user`
--

CREATE TABLE `ttmn_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `roles` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ttmn_user`
--

INSERT INTO `ttmn_user` (`id`, `name`, `email`, `phone`, `username`, `password`, `address`, `avatar`, `roles`, `created_by`, `updated_by`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'adminlar', 'adminlar@gmail.com', '02132123789', 'adminlar', '$2y$12$z3PGXv0rH0tJwwDzspcnhe2rvhjH7svM7yxC17ckxXqd34x6K4l.G', 'long an', 'avatars/gBqWNc4UtxqyP3snh82HkxwYzvBnGbwt9eOwfuKd.jpg', 'admin', 0, NULL, 1, NULL, '2025-04-25 00:13:05', '2025-05-09 14:18:43'),
(3, 'khách hàng 1', 'khachhang1@gmail.com', '1235894750', 'thanhvien', '$2y$12$1LCUFSMhErlqxdnNOs6jc.GLdUGxn13f.1a9A4sRzohNz441CZWXO', 'long an', 'avatars/HXVH4piDzOIZBBGu1XnvSTAPul0iBIe3c74is01I.jpg', 'customer', 0, NULL, 1, NULL, '2025-05-08 02:24:40', '2025-05-10 03:58:56'),
(6, 'khách hàng 67', 'khachhang6@gmail.com', '15786324574', 'hang6', '$2y$12$di8eH1xWaQoW4WTetQ85G.8kS5Hz.JVM.SBQL9m4.t0lA.h5CbNXa', 'long an', 'avatars/DKyj4e9DXHIuTYWPqb1uOFGuKpB6DGFe1feJ0GP8.jpg', 'customer', 0, NULL, 1, NULL, '2025-05-09 10:14:22', '2025-05-10 04:00:23'),
(11, 'kem que dâu', 'dau@gmail.com', '12345674174', 'adminlardau', '$2y$12$LackvFpHV9nsMeINPhNrWuPU08FN4iwXOftcsW7k8Od5hkUyy6y/2', 'long an', 'avatars/5rlL4F73tNZ6fIvsPjraOzlsXfROZP4fH0xHcJTK.jpg', 'customer', 0, NULL, 1, NULL, '2025-05-10 04:33:51', '2025-05-10 04:33:51');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ttmn_banner`
--
ALTER TABLE `ttmn_banner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_banner_image_unique` (`image`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_brand`
--
ALTER TABLE `ttmn_brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_brand_slug_unique` (`slug`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_category`
--
ALTER TABLE `ttmn_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_category_slug_unique` (`slug`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_menu`
--
ALTER TABLE `ttmn_menu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_menu_link_unique` (`link`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_migrations`
--
ALTER TABLE `ttmn_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ttmn_order`
--
ALTER TABLE `ttmn_order`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ttmn_orderdetail`
--
ALTER TABLE `ttmn_orderdetail`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ttmn_post`
--
ALTER TABLE `ttmn_post`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_post_slug_unique` (`slug`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_product`
--
ALTER TABLE `ttmn_product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_product_slug_unique` (`slug`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_topic`
--
ALTER TABLE `ttmn_topic`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_topic_slug_unique` (`slug`) USING HASH;

--
-- Chỉ mục cho bảng `ttmn_ttmn_contact`
--
ALTER TABLE `ttmn_ttmn_contact`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ttmn_user`
--
ALTER TABLE `ttmn_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ttmn_user_email_unique` (`email`),
  ADD UNIQUE KEY `ttmn_user_phone_unique` (`phone`),
  ADD UNIQUE KEY `ttmn_user_username_unique` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ttmn_banner`
--
ALTER TABLE `ttmn_banner`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `ttmn_brand`
--
ALTER TABLE `ttmn_brand`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `ttmn_category`
--
ALTER TABLE `ttmn_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `ttmn_menu`
--
ALTER TABLE `ttmn_menu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `ttmn_migrations`
--
ALTER TABLE `ttmn_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `ttmn_order`
--
ALTER TABLE `ttmn_order`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `ttmn_orderdetail`
--
ALTER TABLE `ttmn_orderdetail`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `ttmn_post`
--
ALTER TABLE `ttmn_post`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `ttmn_product`
--
ALTER TABLE `ttmn_product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `ttmn_topic`
--
ALTER TABLE `ttmn_topic`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `ttmn_ttmn_contact`
--
ALTER TABLE `ttmn_ttmn_contact`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `ttmn_user`
--
ALTER TABLE `ttmn_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
