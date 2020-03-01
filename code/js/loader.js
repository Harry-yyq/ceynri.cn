{
    // TODO 加载时，光标为“加载中”的样式
    // * 在加载时所显示的内容
    class Loader {
        constructor(loader, page) {
            // 一些元素
            this.loader = loader;
            this.overlays = loader.children;
            this.page = page;

            // 覆盖层的个数
            this.overlayNum = loader.childElementCount;
            // 动画时间（秒）
            // 修改该属性时请同时修改 smoothScroll.js 内的 PAGE_LOADED_ANIMATION_TIME 属性
            this.ANIMATION_TIME = 2;
            // 缓动效果类型
            this.EASING = Power4.easeInOut;

            // 初始化页面的位置
            this.initPageScrollTop();
            // 等待页面加载完成，执行动画
            this.listenPageLoadedEvent();
        }
        initPageScrollTop() {
            // * 初始化页面滚动位置
            // 禁止页面滚动
            document.body.style.overflow = 'hidden';

            // 清除浏览器缓存的之前的页面滚动位置
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            } else {
                window.scrollTo(0, 0);
            }
            // 设置页面内容的初始位置，以便播放滚上来的动画
            TweenLite.set(this.page, {
                y: (this.overlayNum * 100) + 'vh'
            });
        }
        disableScroll(e) {
            // * 禁止移动端的滚动事件
            window.scrollTo(0, 0); // 电脑端
            e.preventDefault(); // 移动端
            // 等页面加载完了再允许滚动
        }
        listenPageLoadedEvent() {
            // * 监听页面加载完成事件，进行一些操作
            const pageLoadedAction = () => {
                // 播放动画（y初值已经在css中设置好）
                for (let i = 0; i < this.overlayNum; i++) {
                    TweenLite.to(this.overlays[i], this.ANIMATION_TIME, {
                        y: 0,
                        ease: this.EASING
                    });
                }
                TweenLite.to(this.page, this.ANIMATION_TIME, {
                    y: 0,
                    ease: this.EASING
                });
                // 执行动画播放完的操作
                setTimeout(animationEndAction, this.ANIMATION_TIME * 1000);
            };
            const animationEndAction = () => {
                // 重新允许滚动
                document.body.style.overflow = 'visible';
                this.loader.style.display = 'none';
            }
            window.addEventListener('load', pageLoadedAction);
        }
    }

    const loader = document.querySelector('.loader');
    const page = document.querySelector('div[data-scroll]');
    new Loader(loader, page);
}
