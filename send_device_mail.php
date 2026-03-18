<?php
// get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$to = "pushpakkumar123456789@gmail.com";   // <-- replace with YOUR email
$subject = "New Visitor Device Info";

$message = "Someone visited your website.\n\n" .
           "User Agent: " . $data['userAgent'] . "\n" .
           "Platform: " . $data['platform'] . "\n" .
           "Language: " . $data['language'] . "\n" .
           "Screen Width: " . $data['screenWidth'] . "\n" .
           "Screen Height: " . $data['screenHeight'] . "\n" .
           "Time: " . date("Y-m-d H:i:s") . "\n";

$headers = "From: noreply@yourwebsite.com";  // Optional

mail($to, $subject, $message, $headers);
?>
