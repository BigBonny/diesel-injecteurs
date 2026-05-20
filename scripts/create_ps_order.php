<?php
/**
 * PrestaShop order creation script - bypasses REST API limitation
 * Place this file at: /var/www/clients/client0/web4/web/create_ps_order.php
 * Secured with a secret token
 */

define('_PS_ROOT_DIR_', dirname(__FILE__));
require_once(_PS_ROOT_DIR_ . '/config/config.inc.php');
require_once(_PS_ROOT_DIR_ . '/init.php');

// Security: require secret token
$secret = 'DIESEL_ORDER_SECRET_2024';
$token = isset($_POST['token']) ? $_POST['token'] : '';
if ($token !== $secret) {
    http_response_code(403);
    die(json_encode(['error' => 'Unauthorized']));
}

header('Content-Type: application/json');

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'create') {
    $email      = isset($_POST['email']) ? $_POST['email'] : '';
    $firstName  = isset($_POST['first_name']) ? $_POST['first_name'] : 'Client';
    $lastName   = isset($_POST['last_name']) ? $_POST['last_name'] : 'Client';
    $amount     = isset($_POST['amount']) ? (float)$_POST['amount'] : 0;
    $reference  = isset($_POST['reference']) ? $_POST['reference'] : '';
    $idLang     = 1;
    $idCurrency = 1;
    $idCarrier  = 11;

    // Find or create customer
    $customer = new Customer();
    $customers = Customer::getCustomersByEmail($email);
    if (!empty($customers)) {
        $customer->getByEmail($email);
    } else {
        $customer->firstname   = $firstName;
        $customer->lastname    = $lastName;
        $customer->email       = $email;
        $customer->passwd      = md5(_COOKIE_KEY_ . $reference);
        $customer->id_lang     = $idLang;
        $customer->active      = 1;
        $customer->is_guest    = 1;
        $customer->id_default_group = 3;
        if (!$customer->save()) {
            die(json_encode(['error' => 'Failed to create customer']));
        }
    }

    // Create address
    $address = new Address();
    $address->id_customer = $customer->id;
    $address->id_country  = 8; // France
    $address->alias       = 'commande';
    $address->firstname   = $firstName;
    $address->lastname    = $lastName;
    $address->address1    = 'Non renseignée';
    $address->city        = 'Non renseignée';
    $address->postcode    = '00000';
    if (!$address->save()) {
        die(json_encode(['error' => 'Failed to create address']));
    }

    // Create cart
    $cart = new Cart();
    $cart->id_currency = $idCurrency;
    $cart->id_lang     = $idLang;
    $cart->id_customer = $customer->id;
    $cart->id_address_delivery = $address->id;
    $cart->id_address_invoice  = $address->id;
    $cart->id_carrier  = $idCarrier;
    if (!$cart->save()) {
        die(json_encode(['error' => 'Failed to create cart']));
    }

    // Create order directly via DB (bypass PaymentModule restriction)
    $order = new Order();
    $order->id_address_delivery = $address->id;
    $order->id_address_invoice  = $address->id;
    $order->id_cart             = $cart->id;
    $order->id_currency         = $idCurrency;
    $order->id_customer         = $customer->id;
    $order->id_lang             = $idLang;
    $order->id_carrier          = $idCarrier;
    $order->current_state       = 14; // En attente de paiement
    $order->payment             = 'Sogecommerce';
    $order->module              = 'sogecommerce';
    $order->total_paid          = $amount;
    $order->total_paid_real     = 0;
    $order->total_paid_tax_incl = $amount;
    $order->total_paid_tax_excl = $amount;
    $order->total_products      = $amount;
    $order->total_products_wt   = $amount;
    $order->total_shipping      = 0;
    $order->total_shipping_tax_incl = 0;
    $order->total_discounts     = 0;
    $order->total_discounts_tax_incl = 0;
    $order->conversion_rate     = 1;
    $order->secure_key          = md5($reference);
    $order->reference           = substr($reference, 0, 32);
    $order->valid               = 0;
    $order->date_add            = date('Y-m-d H:i:s');
    $order->date_upd            = date('Y-m-d H:i:s');

    if (!$order->save()) {
        die(json_encode(['error' => 'Failed to create order']));
    }

    // Add order history entry
    $history = new OrderHistory();
    $history->id_order = $order->id;
    $history->id_order_state = 14;
    $history->date_add = date('Y-m-d H:i:s');
    $history->save();

    echo json_encode([
        'success'     => true,
        'order_id'    => $order->id,
        'customer_id' => $customer->id,
        'address_id'  => $address->id,
        'cart_id'     => $cart->id,
    ]);

} elseif ($action === 'update_status') {
    $orderId  = isset($_POST['order_id']) ? (int)$_POST['order_id'] : 0;
    $newState = isset($_POST['state']) ? (int)$_POST['state'] : 0;
    $amount   = isset($_POST['amount']) ? (float)$_POST['amount'] : 0;

    if (!$orderId || !$newState) {
        die(json_encode(['error' => 'Missing order_id or state']));
    }

    $order = new Order($orderId);
    if (!Validate::isLoadedObject($order)) {
        die(json_encode(['error' => 'Order not found']));
    }

    // Update order state
    $history = new OrderHistory();
    $history->id_order = $orderId;
    $history->changeIdOrderState($newState, $order);
    $history->save();

    // Update total_paid_real if paid
    if ($newState == 2 && $amount > 0) {
        $order->total_paid_real = $amount;
        $order->valid = 1;
        $order->save();
    }

    echo json_encode(['success' => true, 'order_id' => $orderId, 'new_state' => $newState]);

} else {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
}
