<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=juba_stationary", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $action = isset($_GET['action']) ? $_GET['action'] : 'read';
    
    if ($action === 'read') {
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        
        if ($category && $category !== 'all') {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE category = ?");
            $stmt->execute([$category]);
        } else {
            $stmt = $pdo->query("SELECT * FROM products");
        }
        
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'products' => $products]);
    }
    elseif ($action === 'create') {
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
        $category = isset($_POST['category']) ? trim($_POST['category']) : '';
        $image = isset($_POST['image']) ? trim($_POST['image']) : '';
        
        if (empty($name) || $price <= 0 || empty($category)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid product data']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO products (name, price, category, image, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $price, $category, $image]);
        
        echo json_encode(['status' => 'success', 'message' => 'Product created successfully']);
    }
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
        $category = isset($_POST['category']) ? trim($_POST['category']) : '';
        $image = isset($_POST['image']) ? trim($_POST['image']) : '';
        
        if ($id <= 0 || empty($name)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid product data']);
            exit;
        }
        
        $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, category = ?, image = ? WHERE id = ?");
        $stmt->execute([$name, $price, $category, $image, $id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Product updated successfully']);
    }
    elseif ($action === 'delete') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid product ID']);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Product deleted successfully']);
    }
    else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>