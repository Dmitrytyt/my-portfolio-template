<?php
/**
 * Sending a message to the site administrator
 *
 * PHP version 5.6
 *
 * @author   Dmitry Turchenko <dmitrytyt@ya.ru>
 * @license  http://opensource.org/licenses/MIT MIT license
 */

require_once '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use \ReCaptcha\ReCaptcha;

/**
 * Class Sender
 *
 * @property string  secret
 * @property string  response
 * @property string  fromEmail
 * @property string  fromName
 * @property string  adminEmail
 * @property string  subject
 * @property array   requiredFields
 * @property array   errors
 *
 * @see https://www.google.com/recaptcha/admin
 */
class Sender {

    private $secret = '';
    private $response = null;
    private $fromEmail = '';
    private $fromName = '';
    private $adminEmail = "";
    private $subject = "";
    private $requiredFields = array('userName' => 256, 'email' => 256, 'phone' => 256, 'note' => 1000);
    private $errors = array();
    private $fileConfig = '../config/config.php';

    public function __construct()
    {
        $config = $this->getConfig($this->fileConfig);
        $this->secret     = $config['secret'];
        $this->fromEmail  = $config['fromEmail'];
        $this->fromName   = $config['fromName'];
        $this->adminEmail = $config['adminEmail'];
        $this->subject    = $config['subject'];
    }

    /**
     *  To start sending
     */
    public function run()
    {
        $data = $this->getData();

        if ( $this->checkData($data) )
        {
            $this->sendEmail($data);
        } else {
            echo json_encode(array('message' => $this->errors));
        }

    }

    /**
     * Check for errors
     * @param $data
     * @return bool
     */
    public function checkData($data)
    {
        foreach ($this->requiredFields as $field => $maxLength)
        {
            if ( !isset($data[$field]) || empty($data[$field]) )
            {
                $this->setError($field, 'Поле обязательно для заполнения!');
            } elseif ( !$this->checkLength($data[$field], 1, $maxLength) ){
                $this->setError($field, 'Поле должно содержать максимум '.$maxLength.' символов!');
            }
        }

        if ( !$this->checkCaptcha($data) ) {
            $this->setError('g-recaptcha-response', 'Вы не прошли капчу!');
        }

        return ( count($this->errors) == 0 ) ? true : false;
    }

    /**
     * Install error
     * @param $name
     * @param $textError
     */
    public function setError($name, $textError)
    {
        $this->errors[$name] = $textError;
    }

    /**
     * Sending a message to the webmaster
     * @param $data
     */
    public function sendEmail($data)
    {
        $mail = new PHPMailer(true);
        try {
            $mail->CharSet = 'utf-8';

            //Recipient
            $mail->setFrom($this->fromEmail, $this->fromName);
            $mail->addAddress($this->adminEmail);
            $mail->addReplyTo($data['email'], $data['userName']);

            //Content
            $mail->isHTML(true);
            $mail->Subject = $this->subject;
            $mail->Body    = $this->getTemplate($data);

            $mail->send();
            $status = array(
                'status' => 'OK',
                'message' => 'Ваша информация успешно отправлена!'
            );

            echo json_encode($status);

        } catch (Exception $e) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        }
    }

    /**
     * HTML template from mail send
     * @param $data
     * @return string
     */
    public function getTemplate($data)
    {
        return '<h1>Информация по заявке:</h1>'.
            '<p><strong>Имя:</strong> '.$data['userName'].'</p>'.
            '<p><strong>Email:</strong> '.$data['email'].'</p>'.
            '<p><strong>Телефон:</strong> '.$data['phone'].'</p>'.
            '<p><strong>Сообщение:</strong><br> '.nl2br($data['note'], false).'</p>'.
            '<p><strong>IP-адрес:</strong> '.$_SERVER['REMOTE_ADDR'].'</p>';
    }

    /**
     * Get filter post data
     * @return mixed
     */
    public function getData()
    {
        $filters = array(
            'userName' => array(
                'filter'  => FILTER_SANITIZE_STRING,
                'flags'   => FILTER_FLAG_STRIP_LOW
            ),

            'email'  => FILTER_VALIDATE_EMAIL,

            'phone' => array(
                'filter'  => FILTER_SANITIZE_STRING,
                'flags'   => FILTER_FLAG_STRIP_LOW
            ),

            'note' => array(
                'filter'  => FILTER_UNSAFE_RAW
            ),

            'g-recaptcha-response' => array(
                'filter'  => FILTER_SANITIZE_STRING,
                'flags'   => FILTER_FLAG_STRIP_LOW
            )
        );

        $data = filter_input_array(INPUT_POST, $filters);

        foreach ($data as $name => $item)
        {
            $data[$name] = $this->clear($item);
        }

        return $data;
    }

    /**
     * Clearing the value
     * @param string $value
     * @return string
     */
    public function clear($value = "")
    {
        $value = trim($value);
        $value = stripslashes($value);
        $value = strip_tags($value);
        $value = htmlspecialchars($value);

        return $value;
    }

    /**
     * Check the length of the string
     * @param string $value
     * @param integer $min
     * @param integer $max
     * @return bool
     */
    public function checkLength($value = "", $min, $max)
    {
        $result = (mb_strlen($value) < $min || mb_strlen($value) > $max);
        return !$result;
    }

    /**
     * Check captcha
     * @param $data
     * @return bool
     */
    public function checkCaptcha($data)
    {
        $reCaptcha = new ReCaptcha($this->secret);

        if ( isset($data['g-recaptcha-response']) && !empty($data['g-recaptcha-response']) ) {

            $this->response = $reCaptcha->verify(
                $data["g-recaptcha-response"],
                $_SERVER["REMOTE_ADDR"]
            );

            if ( $this->response->isSuccess() ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get configuration
     * @param $file
     * @return mixed
     */
    public function getConfig($file)
    {
        return include($file);
    }
}