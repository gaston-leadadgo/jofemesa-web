<?php
/**
 * Medición: Google Tag Manager (17/11/2026).
 *
 * El ID se cambia en JOFEMESA → Ajustes → «Google Tag Manager». Vacío = sin
 * GTM. Va en todas las páginas públicas, también en las que sirve la caché,
 * pero no en el escritorio ni en el editor de Elementor.
 *
 * Fragmento oficial de GTM con la función gtag() definida, como en el
 * código que pasó el cliente: dataLayer listo antes de cargar el
 * contenedor. El script de GTM no se difiere hasta el primer gesto
 * (jm_diferir_js lo deja pasar), para no perder las visitas que no tocan
 * la página.
 *
 * Los parámetros de campaña (utm_*, gclid, fbclid…) no impiden servir la
 * página desde la caché (77-cache-catalogo.php y el drop-in).
 */

if (!defined('ABSPATH')) {
    exit;
}

function jm_gtm_id(): string
{
    $id = strtoupper(trim((string) jm_ajuste('gtm')));
    return preg_match('/^GTM-[A-Z0-9]{4,12}$/', $id) ? $id : '';
}

function jm_gtm_activo(): bool
{
    return jm_gtm_id() !== '' && !is_admin() && !isset($_GET['elementor-preview']) && !is_preview();
}

add_action('wp_head', function () {
    if (!jm_gtm_activo()) {
        return;
    }
    $id = jm_gtm_id();
    echo "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());"
        . "(function(w,d,s,l,i){w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" . esc_js($id) . "');</script>\n";
}, 1);

add_action('wp_body_open', function () {
    if (!jm_gtm_activo()) {
        return;
    }
    echo '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=' . esc_attr(jm_gtm_id()) . '" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>' . "\n";
}, 1);

/** Parámetros de campaña: no cambian la página, así que no la sacan de la caché. */
const JM_PARAMETROS_CAMPANA = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', '_gl'];

function jm_get_sin_campana(): array
{
    return array_diff_key($_GET, array_flip(JM_PARAMETROS_CAMPANA));
}
