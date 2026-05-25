<?php
/**
 * PrestaShop auth script - login and register
 * Place at: /var/www/clients/client0/web4/web/ps_auth.php
 */
error_reporting(0);
define('_PS_ROOT_DIR_', dirname(__FILE__));
require_once(_PS_ROOT_DIR_ . '/config/config.inc.php');

$secret = 'DIESEL_ORDER_SECRET_2024';
$token = isset($_POST['token']) ? $_POST['token'] : '';
if ($token !== $secret) {
    http_response_code(403);
    die(json_encode(['error' => 'Unauthorized']));
}

header('Content-Type: application/json');
$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'login') {
    $email    = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if (!$email || !$password) {
        die(json_encode(['error' => 'Email et mot de passe requis']));
    }

    $customer = new Customer();
    $customer->getByEmail($email);

    if (!Validate::isLoadedObject($customer)) {
        die(json_encode(['error' => 'Email ou mot de passe incorrect']));
    }

    if (!$customer->active) {
        die(json_encode(['error' => 'Compte désactivé']));
    }

    // Verify password - PS8 uses bcrypt via password_hash
    $authenticated = password_verify($password, $customer->passwd);
    if (!$authenticated) {
        $authenticated = ($customer->passwd === md5(_COOKIE_KEY_ . $password));
    }
    if (!$authenticated) {
        $authenticated = ($customer->passwd === md5($password));
    }

    if (!$authenticated) {
        die(json_encode(['error' => 'Email ou mot de passe incorrect']));
    }

    echo json_encode([
        'success'   => true,
        'id'        => $customer->id,
        'email'     => $customer->email,
        'firstname' => $customer->firstname,
        'lastname'  => $customer->lastname,
    ]);

} elseif ($action === 'register') {
    $email     = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password  = isset($_POST['password']) ? $_POST['password'] : '';
    $firstname = isset($_POST['firstname']) ? trim($_POST['firstname']) : '';
    $lastname  = isset($_POST['lastname']) ? trim($_POST['lastname']) : '';

    if (!$email || !$password || !$firstname || !$lastname) {
        die(json_encode(['error' => 'Tous les champs sont requis']));
    }

    if (!Validate::isEmail($email)) {
        die(json_encode(['error' => 'Email invalide']));
    }

    if (strlen($password) < 8) {
        die(json_encode(['error' => 'Le mot de passe doit contenir au moins 8 caractères']));
    }

    // Check if email already exists
    $existing = new Customer();
    $existing->getByEmail($email);
    if (Validate::isLoadedObject($existing)) {
        die(json_encode(['error' => 'Cet email est déjà utilisé']));
    }

    $customer = new Customer();
    $customer->firstname        = $firstname;
    $customer->lastname         = $lastname;
    $customer->email            = $email;
    $customer->passwd           = password_hash($password, PASSWORD_BCRYPT);
    $customer->id_lang          = 1;
    $customer->active           = 1;
    $customer->is_guest         = 0;
    $customer->id_default_group = 3;

    if (!$customer->save()) {
        die(json_encode(['error' => 'Erreur lors de la création du compte']));
    }

    // Create default address
    $address = new Address();
    $address->id_customer = $customer->id;
    $address->id_country  = 8; // France
    $address->alias       = 'Mon adresse';
    $address->firstname   = $firstname;
    $address->lastname    = $lastname;
    $address->address1    = 'À compléter';
    $address->city        = 'À compléter';
    $address->postcode    = '00000';
    $address->save();

    echo json_encode([
        'success'   => true,
        'id'        => $customer->id,
        'email'     => $customer->email,
        'firstname' => $customer->firstname,
        'lastname'  => $customer->lastname,
    ]);

} else {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
}
