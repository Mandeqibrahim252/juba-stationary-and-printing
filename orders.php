<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=juba_stationary", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $action = isset($_GET['action']) ? $_GET['action'] : 'read';
    
    if ($action === 'create') {
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Please login to place an order']);
            exit;
        }
        
        $user_id = $_SESSION['user_id'];
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;
        
        if ($product_id <= 0 || $quantity <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid order data']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, product_id, quantity, status, created_at) VALUES (?, ?, ?, 'pending', NOW())");
        $stmt->execute([$user_id, $product_id, $quantity]);
        
        echo json_encode(['status' => 'success', 'message' => 'Order placed successfully']);
    }
    elseif ($action === 'read') {
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Please login to view orders']);
            exit;
        }
        
        $user_id = $_SESSION['user_id'];
        
        $stmt = $pdo->prepare("
            SELECT o.*, p.name as product_name, p.price 
            FROM orders o 
            JOIN products p ON o.product_id = p.id 
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        ");
        $stmt->execute([$user_id]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['status' => 'success', 'orders' => $orders]);
    }
    elseif ($action === 'admin_read') {
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Admin access required']);
            exit;
        }
        
        $stmt = $pdo->query("
            SELECT o.*, p.name as product_name, p.price, u.name as user_name, u.email as user_email
            FROM orders o 
            JOIN products p ON o.product_id = p.id 
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['status' => 'success', 'orders' => $orders]);
    }
    elseif ($action === 'update_status') {
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Admin access required']);
            exit;
        }
        
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status = isset($_POST['status']) ? trim($_POST['status']) : '';
        
        if ($id <= 0 || empty($status)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            exit;
        }
        
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Order status updated']);
    }
    else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>