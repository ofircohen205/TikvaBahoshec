var EasingLogic = (function () {
    function EasingLogic() {
    }
    return EasingLogic;
}());
export { EasingLogic };
var PageScrollConfig = (function () {
    function PageScrollConfig() {
    }
    Object.defineProperty(PageScrollConfig, "defaultEasingLogic", {
        // Getter and setter to avoid auto completion to suggest calling the method
        get: function () {
            return PageScrollConfig._easingLogic;
        },
        set: function (easingLogic) {
            PageScrollConfig._easingLogic = easingLogic;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The number of milliseconds to wait till updating the scroll position again.
     * Small amounts may produce smoother animations but require more processing power.
     * @type {number}
     * @private
     */
    PageScrollConfig._interval = 10;
    /**
     * The amount of pixels that need to be between the current scrollTop/scrollLeft position
     * and the target position the cause a scroll animation. In case distance is below
     * this threshold, an immediate jump will be performed.
     * Due to dpi or rounding irregularities in browsers floating point numbers for scrollTop/scrollLeft values
     * are possible, making a === comparison of current scrollTop or scrollLeft and target scrollPosition error-prone.
     * @type {number}
     * @private
     */
    PageScrollConfig._minScrollDistance = 2;
    /**
     * Name of the default namespace.
     * @type {string}
     * @private
     */
    PageScrollConfig._defaultNamespace = 'default';
    /**
     * Whether by default the scrolling should happen in vertical direction (by manipulating the scrollTop property)
     * (= true; default) or in horizontal direction (by manipulating the scrollLeft property) (= false
     * @type {boolean}
     */
    PageScrollConfig.defaultIsVerticalScrolling = true;
    /**
     * How many console logs should be emitted. Also influenced by angular mode (dev or prod mode)
     * 0: No logs, neither in dev nor in prod mode
     * 1: Animation errors in dev mode, no logs in prod mode
     * 2: Animation errors in dev and prod mode
     * 5: Animation errors in dev and all scroll position values that get set; animation errors in prod mode
     * @type {boolean}
     * @private
     */
    PageScrollConfig._logLevel = 2;
    /**
     * The duration how long a scrollTo animation should last by default.
     * May be overridden using the page-scroll-duration attribute on a single ng2PageScroll instance.
     * @type {number}
     */
    PageScrollConfig.defaultDuration = 1250;
    /**
     * The distance in pixels above scroll target where the animation should stop. Setting a positive number results in
     * the scroll target being more in the middle of the screen, negative numbers will produce scrolling "too far"
     * @type {number}
     */
    PageScrollConfig.defaultScrollOffset = 0;
    /**
     * Whether by default for inline scroll animations the advanced offset calculation should take place (true) or
     * not (false). Default is false.
     * The advanced offset calculation will traverse the DOM tree upwards, starting at the scrollTarget, until it finds
     * the scrollingView container element. Along the way the offset positions of the relative positioned
     * (position: relative) elements will be taken into account for calculating the target elements position.
     * @type {boolean}
     */
    PageScrollConfig.defaultAdvancedInlineOffsetCalculation = false;
    /**
     * The events that are listened to on the body to decide whether a scroll animation has been interfered/interrupted by the user
     * @type {string[]}
     * @private
     */
    PageScrollConfig._interruptEvents = ['mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'keyup', 'touchmove'];
    /**
     * The keys that are considered to interrupt a scroll animation (mainly the arrow keys). All other key presses will not stop the
     * scroll animation.
     * @type {number[]}
     * @private
     */
    PageScrollConfig._interruptKeys = [33, 34, 35, 36, 38, 40];
    /**
     * Whether a scroll animation should be interruptible by user interaction (true) or not (false). If the user performs an
     * interrupting event while a scroll animation takes place, the scroll animation stops.
     * @type {boolean}
     */
    PageScrollConfig.defaultInterruptible = true;
    PageScrollConfig._easingLogic = {
        ease: function (t, b, c, d) {
            // Linear easing
            return c * t / d + b;
        }
    };
    return PageScrollConfig;
}());
export { PageScrollConfig };
