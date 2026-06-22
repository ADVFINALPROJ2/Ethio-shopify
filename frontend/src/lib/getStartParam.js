export const getStartParam = () => {
    // In Telegram
    const tgParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (tgParam) return tgParam;

    // In browser dev: ?startapp=shop_my-shop
    const urlParam = new URLSearchParams(window.location.search).get('startapp');
    return urlParam || null;
};