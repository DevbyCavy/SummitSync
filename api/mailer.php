<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

/**
 * Sends a plain-text email via PHPMailer over SMTP.
 * Install PHPMailer with `composer require phpmailer/phpmailer` inside api/ (creates api/vendor/).
 * Returns false (and logs) on failure so callers can decide how to respond.
 */
function send_mail(string $subject, string $body, ?string $replyTo = null, ?string $replyName = null): bool
{
    $autoload = __DIR__ . '/vendor/autoload.php';
    if (!is_file($autoload)) {
        error_log('Summit Sync API: PHPMailer not installed (api/vendor missing)');
        return false;
    }
    require_once $autoload;

    $m = config()['mail'];
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $m['smtp_host'];
        $mail->Port = (int)$m['smtp_port'];
        $mail->SMTPAuth = true;
        $mail->Username = $m['smtp_user'];
        $mail->Password = $m['smtp_pass'];
        $mail->SMTPSecure = $m['smtp_secure'] === 'tls'
            ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
            : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($m['from'], $m['from_name']);
        $mail->addAddress($m['to']);
        if ($replyTo) {
            $mail->addReplyTo($replyTo, $replyName ?? '');
        }
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->isHTML(false);
        $mail->send();
        return true;
    } catch (Throwable $e) {
        error_log('Summit Sync API mail error: ' . $mail->ErrorInfo);
        return false;
    }
}
