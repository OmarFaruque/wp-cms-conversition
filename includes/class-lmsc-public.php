<?php

if (!defined('ABSPATH')) {
    exit;
}

if(!class_exists('LMSC_Public')){
class LMSC_Public
{

    /**
     * @var    object
     * @access  private
     * @since    1.0.0
     */
    private static $instance = null;

    /**
     * The version number.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $version;

    /**
     * The main plugin file.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $file;

    /**
     * The token.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $token;

    /**
     * The plugin assets URL.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $assets_url;

    /**
     * Wp db
     * @access  private
     */
    private $wpdb;

    /**
     * Constructor function.
     *
     * @access  public
     * @param string $file Plugin root file path.
     * @since   1.0.0
     */
    public function __construct($file = '')
    {
        global $wpdb; 
        $this->wpdb = $wpdb;
        $this->version = LMSC_VERSION;
        $this->token = LMSC_TOKEN;
        $this->file = $file;
        $this->assets_url = esc_url(trailingslashit(plugins_url('/assets/', $this->file)));

        if(LMSC_Helper()->is_any_cms_activated()){
            add_action('init', array($this, 'init'));
        }

        add_action( 'wp_head', array($this, 'testF') );
    }


    public function testF(){
        // $enrolled_usrs = $this->lmsc_get_enrolled_usrs();
        // echo 'enrolled Usrs <br/><pre>';
        // print_r($enrolled_usrs);
        // echo '</pre>';
    }



    /**
     * @access  private
     * @desc    get enrolled users
     */
    public function lmsc_get_enrolled_usrs(){
        global $post;
        $activity_table = LDLMS_DB::get_table_name( 'user_activity' );
        $usres = array($post->post_author);
        $enrolled_users = $this->wpdb->get_results($this->wpdb->prepare( 'SELECT `user_id` FROM '.$activity_table.' WHERE `post_id`=%d AND `activity_type`=%s', $post->ID, 'access'), OBJECT);
        $enrolled_users = array_map(function($v){
            return $v->user_id;
        }, $enrolled_users); 

        $usres = array_merge($usres, $enrolled_users);
        return $usres;
    }

    /**
     * @access  public
     * @return  footer html for chat application
     */
    public function lmsc_foother_callback(){
        global $post, $current_user;

        echo 'current usres data <pre>';
        print_r($current_user);
        echo '</pre>';

        echo 'current usres data <pre>';
        print_r($post);
        echo '</pre>';
        
        $append = false;
        if(is_singular( 'sfwd-courses' ))
            $append = true;    
        
        if($append === false)
            return false;

        // JS
        wp_enqueue_script( $this->token . '-frontendJS' );

        // CSS
        wp_enqueue_style($this->token . '-frontend');

        // Localize a script.
        wp_localize_script(
            $this->token . '-frontendJS',
            $this->token . '_object',
            array(
                'api_nonce' => wp_create_nonce('wp_rest'),
                'root' => rest_url($this->token . '/v1/'),
                'assets_url' => $this->assets_url,
                'post_id' => $post->ID, 
                'user_id' => get_current_user_id(  ),
                'avatar_url' => get_avatar_url( get_current_user_id(  ) ), 
                'email' => $current_user->user_email, 
                'display_name' => $current_user->data->display_name, 
                'user_type' => $post->post_author == get_current_user_id(  ) ? 'teacher' : 'student'
            )
        );


        echo (
            '<div id="' . $this->token . '_chat_ui">
              <div class="' . $this->token . '_loader"><p>' . __('Loading User Interface...', 'lms-conversation') . '</p></div>
            </div>'
        );
    }

    /** Handle Post Typ registration all here
     */
    public function init()
    {
        if(is_user_logged_in(  ) && !is_admin()){
            add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_styles'), 10);
            add_action(  'wp_footer', array($this, 'lmsc_foother_callback') );
        }
    }

    /**
     * Ensures only one instance of APIFW_Front_End is loaded or can be loaded.
     *
     * @param string $file Plugin root file path.
     * @return Main APIFW_Front_End instance
     * @since 1.0.0
     * @static
     */
    public static function instance($file = '')
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($file);
        }
        return self::$instance;
    }

    /**
     * Load Front End CSS.
     *
     * @access  public
     * @return  void
     * @since   1.0.0
     */
    public function frontend_enqueue_styles()
    {
        //JS 
        wp_register_script( $this->token . '-frontendJS', esc_url($this->assets_url) . 'js/frontend.js', array(), $this->version, true );
        
        //CSS
        wp_register_style($this->token . '-frontend', esc_url($this->assets_url) . 'css/frontend.css', array(), $this->version);
    }


}
}