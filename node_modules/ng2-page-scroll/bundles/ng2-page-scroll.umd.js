(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/router', '@angular/common'], factory) :
	(factory((global.ng2 = global.ng2 || {}, global.ng2.page = global.ng2.page || {}, global.ng2.page.scroll = {}),global.ng.core,global.ng.router,global.ng.common));
}(this, (function (exports,core,router,common) { 'use strict';

var EasingLogic = (function () {
    function EasingLogic() {
    }
    return EasingLogic;
}());
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

var PageScrollUtilService = (function () {
    function PageScrollUtilService() {
    }
    /**
     * Util method to check whether a given variable is either undefined or null
     * @param variable
     * @returns {boolean} true the variable is undefined or null
     */
    PageScrollUtilService.isUndefinedOrNull = function (variable) {
        return (typeof variable === 'undefined') || variable === undefined || variable === null;
    };
    PageScrollUtilService.extractElementPosition = function (document, scrollTargetElement) {
        var body = document.body;
        var docEl = document.documentElement;
        var windowPageYOffset = document.defaultView && document.defaultView.pageYOffset || undefined;
        var windowPageXOffset = document.defaultView && document.defaultView.pageXOffset || undefined;
        var scrollTop = windowPageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = windowPageXOffset || docEl.scrollLeft || body.scrollLeft;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        if (PageScrollUtilService.isUndefinedOrNull(scrollTargetElement)) {
            // No element found, so return the current position to not cause any change in scroll position
            return { top: scrollTop, left: scrollLeft };
        }
        var box = scrollTargetElement.getBoundingClientRect();
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    };
    return PageScrollUtilService;
}());

var PageScrollService = (function () {
    function PageScrollService() {
        var _this = this;
        this.runningInstances = [];
        this.onInterrupted = {
            report: function (event, pageScrollInstance) {
                if (!pageScrollInstance.interruptible) {
                    // Non-interruptible anyway, so do not stop anything
                    return;
                }
                var shouldStop = true;
                if (event.type === 'keyup') {
                    // Only stop if specific keys have been pressed, for all others don't stop anything
                    if (PageScrollConfig._interruptKeys.indexOf(event.keyCode) === -1) {
                        // The pressed key is not in the list of interrupting keys
                        shouldStop = false;
                    }
                }
                else if (event.type === 'mousedown') {
                    // For mousedown events we only stop the scroll animation of the mouse has
                    // been clicked inside the scrolling container
                    if (!pageScrollInstance.scrollingViews.some(function (scrollingView) { return scrollingView.contains(event.target); })) {
                        // Mouse clicked an element which is not inside any of the the scrolling containers
                        shouldStop = false;
                    }
                }
                if (shouldStop) {
                    _this.stopAll(pageScrollInstance.namespace);
                }
            }
        };
        if (PageScrollService.instanceCounter > 0 &&
            (PageScrollConfig._logLevel >= 2 || (PageScrollConfig._logLevel >= 1 && core.isDevMode()))) {
            console.warn('An instance of PageScrollService already exists, usually ' +
                'including one provider should be enough, so double check.');
        }
        PageScrollService.instanceCounter++;
    }
    PageScrollService.prototype.stopInternal = function (interrupted, pageScrollInstance) {
        var index = this.runningInstances.indexOf(pageScrollInstance);
        if (index >= 0) {
            this.runningInstances.splice(index, 1);
        }
        if (pageScrollInstance.interruptListenersAttached) {
            pageScrollInstance.detachInterruptListeners();
        }
        if (pageScrollInstance.timer) {
            // Clear/Stop the timer
            clearInterval(pageScrollInstance.timer);
            // Clear the reference to this timer
            pageScrollInstance.timer = undefined;
            pageScrollInstance.fireEvent(!interrupted);
            return true;
        }
        return false;
    };
    /**
     * Start a scroll animation. All properties of the animation are stored in the given {@link PageScrollInstance} object.
     *
     * This is the core functionality of the whole library.
     *
     * @param pageScrollInstance
     */
    PageScrollService.prototype.start = function (pageScrollInstance) {
        var _this = this;
        // Stop all possibly running scroll animations in the same namespace
        this.stopAll(pageScrollInstance.namespace);
        if (pageScrollInstance.scrollingViews === null || pageScrollInstance.scrollingViews.length === 0) {
            // No scrollingViews specified, thus we can't animate anything
            if (PageScrollConfig._logLevel >= 2 || (PageScrollConfig._logLevel >= 1 && core.isDevMode())) {
                console.warn('No scrollingViews specified, this ng2-page-scroll does not know which DOM elements to scroll');
            }
            return;
        }
        var startScrollPositionFound = false;
        // Reset start scroll position to 0. If any of the scrollingViews has a different one, it will be extracted next
        pageScrollInstance.startScrollPosition = 0;
        // Get the start scroll position from the scrollingViews (e.g. if the user already scrolled down the content)
        pageScrollInstance.scrollingViews.forEach(function (scrollingView) {
            if (PageScrollUtilService.isUndefinedOrNull(scrollingView)) {
                return;
            }
            // Get the scrollTop or scrollLeft value of the first scrollingView that returns a value for its "scrollTop"
            // or "scrollLeft" property that is not undefined and unequal to 0
            var scrollPosition = pageScrollInstance.getScrollPropertyValue(scrollingView);
            if (!startScrollPositionFound && scrollPosition) {
                // We found a scrollingView that does not have scrollTop or scrollLeft 0
                // Return the scroll position value, as this will be our startScrollPosition
                pageScrollInstance.startScrollPosition = scrollPosition;
                startScrollPositionFound = true;
            }
        });
        var pageScrollOffset = pageScrollInstance.getCurrentOffset();
        // Calculate the target position that the scroll animation should go to
        var scrollTargetPosition = pageScrollInstance.extractScrollTargetPosition();
        pageScrollInstance.targetScrollPosition = Math.round((pageScrollInstance.verticalScrolling ? scrollTargetPosition.top : scrollTargetPosition.left) - pageScrollOffset);
        // Calculate the distance we need to go in total
        pageScrollInstance.distanceToScroll = pageScrollInstance.targetScrollPosition - pageScrollInstance.startScrollPosition;
        if (isNaN(pageScrollInstance.distanceToScroll)) {
            // We weren't able to find the target position, maybe the element does not exist?
            if (PageScrollConfig._logLevel >= 2 || (PageScrollConfig._logLevel >= 1 && core.isDevMode())) {
                console.log('Scrolling not possible, as we can\'t find the specified target');
            }
            pageScrollInstance.fireEvent(false);
            return;
        }
        // We're at the final destination already
        // OR we need to scroll down but are already at the end
        // OR we need to scroll up but are at the top already
        var allReadyAtDestination = Math.abs(pageScrollInstance.distanceToScroll) < PageScrollConfig._minScrollDistance;
        // Check how long we need to scroll if a speed option is given
        // Default executionDuration is the specified duration
        pageScrollInstance.executionDuration = pageScrollInstance.duration;
        // Maybe we need to pay attention to the speed option?
        if (!PageScrollUtilService.isUndefinedOrNull(pageScrollInstance.speed) && PageScrollUtilService.isUndefinedOrNull(pageScrollInstance.duration)) {
            // Speed option is set and no duration => calculate duration based on speed and scroll distance
            pageScrollInstance.executionDuration = Math.abs(pageScrollInstance.distanceToScroll) / pageScrollInstance.speed * 1000;
        }
        // We should go there directly, as our "animation" would have one big step
        // only anyway and this way we save the interval stuff
        var tooShortInterval = pageScrollInstance.executionDuration <= PageScrollConfig._interval;
        if (allReadyAtDestination || tooShortInterval) {
            if (PageScrollConfig._logLevel >= 2 || (PageScrollConfig._logLevel >= 1 && core.isDevMode())) {
                if (allReadyAtDestination) {
                    console.log('Scrolling not possible, as we can\'t get any closer to the destination');
                }
                else {
                    console.log('Scroll duration shorter that interval length, jumping to target');
                }
            }
            pageScrollInstance.setScrollPosition(pageScrollInstance.targetScrollPosition);
            pageScrollInstance.fireEvent(true);
            return;
        }
        // Register the interrupt listeners if we want an interruptible scroll animation
        if (pageScrollInstance.interruptible ||
            (PageScrollUtilService.isUndefinedOrNull(pageScrollInstance.interruptible) && PageScrollConfig.defaultInterruptible)) {
            pageScrollInstance.attachInterruptListeners(this.onInterrupted);
        }
        // Let's get started, get the start time...
        pageScrollInstance.startTime = new Date().getTime();
        // .. and calculate the end time (when we need to finish at last)
        pageScrollInstance.endTime = pageScrollInstance.startTime + pageScrollInstance.executionDuration;
        pageScrollInstance.timer = setInterval(function (_pageScrollInstance) {
            // Take the current time
            var currentTime = new Date().getTime();
            // Determine the new scroll position
            var newScrollPosition;
            var stopNow = false;
            if (_pageScrollInstance.endTime <= currentTime) {
                // We're over the time already, so go the targetScrollPosition (aka destination)
                newScrollPosition = _pageScrollInstance.targetScrollPosition;
                stopNow = true;
            }
            else {
                // Calculate the scroll position based on the current time using the easing function
                newScrollPosition = Math.round(_pageScrollInstance.easingLogic.ease(currentTime - _pageScrollInstance.startTime, _pageScrollInstance.startScrollPosition, _pageScrollInstance.distanceToScroll, _pageScrollInstance.executionDuration));
            }
            // Set the new scrollPosition to all scrollingViews elements
            if (!_pageScrollInstance.setScrollPosition(newScrollPosition)) {
                // Setting the new scrollTop/scrollLeft value failed for all ScrollingViews
                // early stop the scroll animation to save resources
                stopNow = true;
            }
            // At the end do the internal stop maintenance and fire the pageScrollFinish event
            // (otherwise the event might arrive at "too early")
            if (stopNow) {
                _this.stopInternal(false, _pageScrollInstance);
            }
        }, PageScrollConfig._interval, pageScrollInstance);
        // Register the instance as running one
        this.runningInstances.push(pageScrollInstance);
    };
    /**
     * Stop all running scroll animations. Optionally limit to stop only the ones of specific namespace.
     *
     * @param namespace
     * @returns {boolean}
     */
    PageScrollService.prototype.stopAll = function (namespace) {
        if (this.runningInstances.length > 0) {
            var stoppedSome = false;
            for (var i = 0; i < this.runningInstances.length; ++i) {
                var pageScrollInstance = this.runningInstances[i];
                if (PageScrollUtilService.isUndefinedOrNull(namespace) || namespace.length === 0 ||
                    pageScrollInstance.namespace === namespace) {
                    stoppedSome = true;
                    this.stopInternal(true, pageScrollInstance);
                    // Decrease the counter, as we removed an item from the array we iterate over
                    i--;
                }
            }
            return stoppedSome;
        }
        return false;
    };
    PageScrollService.prototype.stop = function (pageScrollInstance) {
        return this.stopInternal(true, pageScrollInstance);
    };
    PageScrollService.instanceCounter = 0;
    PageScrollService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    PageScrollService.ctorParameters = function () { return []; };
    return PageScrollService;
}());
/* singleton pattern taken from https://github.com/angular/angular/issues/13854 */
function NG2PAGESCROLL_SERVICE_PROVIDER_FACTORY(parentDispatcher) {
    return parentDispatcher || new PageScrollService();
}
var NG2PAGESCROLL_SERVICE_PROVIDER = {
    provide: PageScrollService,
    deps: [[new core.Optional(), new core.SkipSelf(), PageScrollService]],
    useFactory: NG2PAGESCROLL_SERVICE_PROVIDER_FACTORY
};

/**
 * Represents a scrolling action
 */
var PageScrollInstance = (function () {
    /**
     * Private constructor, requires the properties assumed to be the bare minimum.
     * Use the factory methods to create instances:
     *      {@link PageScrollInstance#simpleInstance}
     *      {@link PageScrollInstance#newInstance}
     * @param namespace
     * @param document
     */
    function PageScrollInstance(namespace, document) {
        /**
         * These properties will be set during instance construction and default to their defaults from PageScrollConfig
         */
        /* A namespace to "group" scroll animations together and stopping some does not stop others */
        this._namespace = PageScrollConfig._defaultNamespace;
        /* Whether we scroll vertically (true) or horizontally (false) */
        this._verticalScrolling = PageScrollConfig.defaultIsVerticalScrolling;
        /* Offset in px that the animation should stop above that target element */
        this._offset = PageScrollConfig.defaultScrollOffset;
        /* Duration in milliseconds the scroll animation should last */
        this._duration = PageScrollConfig.defaultDuration;
        /* Easing function to manipulate the scrollTop/scrollLeft value over time */
        this._easingLogic = PageScrollConfig.defaultEasingLogic;
        /* Boolean whether the scroll animation should stop on user interruption or not */
        this._interruptible = PageScrollConfig.defaultInterruptible;
        /* Whether the advanded offset calculation for inline scrolling should be used */
        this._advancedInlineOffsetCalculation = PageScrollConfig.defaultAdvancedInlineOffsetCalculation;
        /* Event emitter to notify the world about the scrolling */
        this._pageScrollFinish = new core.EventEmitter();
        /**
         * These properties will be set/manipulated if the scroll animation starts
         */
        /* The initial value of the scrollTop or scrollLeft position when the animation starts */
        this._startScrollPosition = 0;
        /* Whether an interrupt listener is attached to the body or not */
        this._interruptListenersAttached = false;
        /* References to the timer instance that is used to perform the scroll animation to be
         able to clear it on animation end*/
        this._timer = null;
        this._namespace = namespace;
        this.document = document;
    }
    /*
     * Factory methods for instance creation
     */
    PageScrollInstance.simpleInstance = function (document, scrollTarget, namespace) {
        return PageScrollInstance.newInstance({
            document: document,
            scrollTarget: scrollTarget,
            namespace: namespace
        });
    };
    PageScrollInstance.newInstance = function (options) {
        if (PageScrollUtilService.isUndefinedOrNull(options.namespace) || options.namespace.length <= 0) {
            options.namespace = PageScrollConfig._defaultNamespace;
        }
        var pageScrollInstance = new PageScrollInstance(options.namespace, document);
        if (PageScrollUtilService.isUndefinedOrNull(options.scrollingViews) || options.scrollingViews.length === 0) {
            pageScrollInstance._isInlineScrolling = false;
            pageScrollInstance._scrollingViews = [document.documentElement, document.body, document.body.parentNode];
        }
        else {
            pageScrollInstance._isInlineScrolling = true;
            pageScrollInstance._scrollingViews = options.scrollingViews;
        }
        pageScrollInstance._scrollTarget = options.scrollTarget;
        if (!PageScrollUtilService.isUndefinedOrNull(options.verticalScrolling)) {
            pageScrollInstance._verticalScrolling = options.verticalScrolling;
        }
        if (!PageScrollUtilService.isUndefinedOrNull(options.pageScrollOffset)) {
            pageScrollInstance._offset = options.pageScrollOffset;
        }
        if (!PageScrollUtilService.isUndefinedOrNull(options.pageScrollEasingLogic)) {
            pageScrollInstance._easingLogic = options.pageScrollEasingLogic;
        }
        if (PageScrollUtilService.isUndefinedOrNull(options.pageScrollDuration) && !PageScrollUtilService.isUndefinedOrNull(options.pageScrollSpeed)) {
            // No duration specified in the options, only in this case we use the speed option when present
            pageScrollInstance._speed = options.pageScrollSpeed;
            pageScrollInstance._duration = undefined;
        }
        else if (!PageScrollUtilService.isUndefinedOrNull(options.pageScrollDuration)) {
            pageScrollInstance._duration = options.pageScrollDuration;
        }
        if (!PageScrollUtilService.isUndefinedOrNull(options.pageScrollFinishListener)) {
            pageScrollInstance._pageScrollFinish = options.pageScrollFinishListener;
        }
        pageScrollInstance._interruptible = options.pageScrollInterruptible ||
            (PageScrollUtilService.isUndefinedOrNull(options.pageScrollInterruptible) && PageScrollConfig.defaultInterruptible);
        pageScrollInstance._advancedInlineOffsetCalculation = options.advancedInlineOffsetCalculation ||
            (PageScrollUtilService.isUndefinedOrNull(options.advancedInlineOffsetCalculation) &&
                PageScrollConfig.defaultAdvancedInlineOffsetCalculation);
        return pageScrollInstance;
    };
    PageScrollInstance.prototype.getScrollPropertyValue = function (scrollingView) {
        if (!this.verticalScrolling) {
            return scrollingView.scrollLeft;
        }
        return scrollingView.scrollTop;
    };
    /**
     * Extract the exact location of the scrollTarget element.
     *
     * Extract the scrollTarget HTMLElement from the given PageScrollTarget object. The latter one may be
     * a string like "#heading2", then this method returns the corresponding DOM element for that id.
     *
     * @returns {HTMLElement}
     */
    PageScrollInstance.prototype.extractScrollTargetPosition = function () {
        var scrollTargetElement;
        if (typeof this._scrollTarget === 'string') {
            var targetSelector = this._scrollTarget;
            if (targetSelector.match(/^#[^\s]+$/g) !== null) {
                // It's an id selector and a valid id, as it does not contain any white space characters
                scrollTargetElement = this.document.getElementById(targetSelector.substr(1));
            }
            else {
                scrollTargetElement = this.document.querySelector(targetSelector);
            }
        }
        else {
            scrollTargetElement = this._scrollTarget;
        }
        if (scrollTargetElement === null || scrollTargetElement === undefined) {
            // Scroll target not found
            return { top: NaN, left: NaN };
        }
        if (this._isInlineScrolling) {
            var position = { top: scrollTargetElement.offsetTop, left: scrollTargetElement.offsetLeft };
            if (this._advancedInlineOffsetCalculation && this.scrollingViews.length === 1) {
                var accumulatedParentsPos = { top: 0, left: 0 };
                // not named window to make sure we're not getting the global window variable by accident
                var theWindow = scrollTargetElement.ownerDocument.defaultView;
                var parentFound = false;
                // Start parent is the immediate parent
                var parent_1 = scrollTargetElement.parentElement;
                // Iterate upwards all parents
                while (!parentFound && !PageScrollUtilService.isUndefinedOrNull(parent_1)) {
                    if (theWindow.getComputedStyle(parent_1).getPropertyValue('position') === 'relative') {
                        accumulatedParentsPos.top += parent_1.offsetTop;
                        accumulatedParentsPos.left += parent_1.offsetLeft;
                    }
                    // Next iteration
                    parent_1 = parent_1.parentElement;
                    parentFound = parent_1 === this.scrollingViews[0];
                }
                if (parentFound) {
                    // Only use the results if we found the parent, otherwise we accumulated too much anyway
                    position.top += accumulatedParentsPos.top;
                    position.left += accumulatedParentsPos.left;
                }
                else {
                    if (PageScrollConfig._logLevel >= 2 || (PageScrollConfig._logLevel >= 1 && core.isDevMode())) {
                        console.warn('Unable to find nested scrolling targets parent!');
                    }
                }
            }
            return position;
        }
        return PageScrollUtilService.extractElementPosition(this.document, scrollTargetElement);
    };
    /**
     * Get the top offset of the scroll animation.
     * This automatically takes the offset location of the scrolling container/scrolling view
     * into account (for nested/inline scrolling).
     *
     * @returns {number}
     */
    PageScrollInstance.prototype.getCurrentOffset = function () {
        return this._offset;
    };
    /**
     * Sets the "scrollTop" or "scrollLeft" property for all scrollingViews to the provided value
     * @param position
     * @return true if at least for one ScrollTopSource the scrollTop/scrollLeft value could be set and it kept the new value.
     *          false if it failed for all ScrollingViews, meaning that we should stop the animation
     *          (probably because we're at the end of the scrolling region)
     */
    PageScrollInstance.prototype.setScrollPosition = function (position) {
        var _this = this;
        if (PageScrollConfig._logLevel >= 5 && core.isDevMode()) {
            console.warn('Scroll Position: ' + position);
        }
        // Set the new scrollTop/scrollLeft to all scrollingViews elements
        return this.scrollingViews.reduce(function (oneAlreadyWorked, scrollingView) {
            var startScrollPropertyValue = _this.getScrollPropertyValue(scrollingView);
            if (scrollingView && !PageScrollUtilService.isUndefinedOrNull(startScrollPropertyValue)) {
                var scrollDistance = Math.abs(startScrollPropertyValue - position);
                // The movement we need to perform is less than 2px
                // This we consider a small movement which some browser may not perform when
                // changing the scrollTop/scrollLeft property
                // Thus in this cases we do not stop the scroll animation, although setting the
                // scrollTop/scrollLeft value "fails"
                var isSmallMovement = scrollDistance < PageScrollConfig._minScrollDistance;
                if (!_this.verticalScrolling) {
                    scrollingView.scrollLeft = position;
                }
                else {
                    scrollingView.scrollTop = position;
                }
                // Return true of setting the new scrollTop/scrollLeft value worked
                // We consider that it worked if the new scrollTop/scrollLeft value is closer to the
                // desired scrollTop/scrollLeft than before (it might not be exactly the value we
                // set due to dpi or rounding irregularities)
                if (isSmallMovement || scrollDistance > Math.abs(_this.getScrollPropertyValue(scrollingView) - position)) {
                    return true;
                }
            }
            return oneAlreadyWorked;
        }, false);
    };
    /**
     * Trigger firing a animation finish event
     * @param value Whether the animation finished at the target (true) or got interrupted (false)
     */
    PageScrollInstance.prototype.fireEvent = function (value) {
        if (this._pageScrollFinish) {
            this._pageScrollFinish.emit(value);
        }
    };
    /**
     * Attach the interrupt listeners to the PageScrollInstance body. The given interruptReporter
     * will be called if any of the attached events is fired.
     *
     * Possibly attached interruptListeners are automatically removed from the body before the new one will be attached.
     *
     * @param interruptReporter
     */
    PageScrollInstance.prototype.attachInterruptListeners = function (interruptReporter) {
        var _this = this;
        if (this._interruptListenersAttached) {
            // Detach possibly existing listeners first
            this.detachInterruptListeners();
        }
        this._interruptListener = function (event) {
            interruptReporter.report(event, _this);
        };
        PageScrollConfig._interruptEvents.forEach(function (event) { return _this.document.body.addEventListener(event, _this._interruptListener); });
        this._interruptListenersAttached = true;
    };
    /**
     * Remove event listeners from the body and stop listening for events that might be treated as "animation
     * interrupt" events.
     */
    PageScrollInstance.prototype.detachInterruptListeners = function () {
        var _this = this;
        PageScrollConfig._interruptEvents.forEach(function (event) { return _this.document.body.removeEventListener(event, _this._interruptListener); });
        this._interruptListenersAttached = false;
    };
    Object.defineProperty(PageScrollInstance.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "scrollTarget", {
        get: function () {
            return this._scrollTarget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "verticalScrolling", {
        get: function () {
            return this._verticalScrolling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "scrollingViews", {
        get: function () {
            return this._scrollingViews;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "startScrollPosition", {
        get: function () {
            return this._startScrollPosition;
        },
        set: function (value) {
            this._startScrollPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "targetScrollPosition", {
        get: function () {
            return this._targetScrollPosition;
        },
        set: function (value) {
            this._targetScrollPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "distanceToScroll", {
        get: function () {
            return this._distanceToScroll;
        },
        set: function (value) {
            this._distanceToScroll = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "executionDuration", {
        get: function () {
            return this._executionDuration;
        },
        set: function (value) {
            this._executionDuration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "easingLogic", {
        get: function () {
            return this._easingLogic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "interruptible", {
        get: function () {
            return this._interruptible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "endTime", {
        get: function () {
            return this._endTime;
        },
        set: function (value) {
            this._endTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "timer", {
        get: function () {
            return this._timer;
        },
        set: function (value) {
            this._timer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "interruptListenersAttached", {
        get: function () {
            return this._interruptListenersAttached;
        },
        enumerable: true,
        configurable: true
    });
    return PageScrollInstance;
}());

var PageScroll = (function () {
    function PageScroll(pageScrollService, router$$1, document) {
        this.pageScrollService = pageScrollService;
        this.router = router$$1;
        this.pageScrollTarget = null;
        this.pageScrollHorizontal = null;
        this.pageScrollOffset = null;
        this.pageScrollDuration = null;
        this.pageScrollSpeed = null;
        this.pageScrollEasing = null;
        this.pageScrollAdjustHash = false;
        this.pageScroll = null;
        this.pageScrollFinish = new core.EventEmitter();
        this.document = document;
    }
    PageScroll.prototype.ngOnChanges = function (changes) {
        // Some inputs changed, reset the pageScrollInstance
        this.pageScrollInstance = undefined;
    };
    PageScroll.prototype.ngOnDestroy = function () {
        if (this.pageScrollInstance) {
            this.pageScrollService.stop(this.pageScrollInstance);
        }
        return undefined;
    };
    PageScroll.prototype.generatePageScrollInstance = function () {
        if (PageScrollUtilService.isUndefinedOrNull(this.pageScrollInstance)) {
            this.pageScrollInstance = PageScrollInstance.newInstance({
                document: this.document,
                scrollTarget: this.pageScrollTarget || this.href,
                scrollingViews: null,
                namespace: this.pageScroll,
                verticalScrolling: !this.pageScrollHorizontal,
                pageScrollOffset: this.pageScrollOffset,
                pageScrollInterruptible: this.pageScrollInterruptible,
                pageScrollEasingLogic: this.pageScrollEasing,
                pageScrollDuration: this.pageScrollDuration,
                pageScrollSpeed: this.pageScrollSpeed,
                pageScrollFinishListener: this.pageScrollFinish
            });
        }
        return this.pageScrollInstance;
    };
    PageScroll.prototype.pushRouterState = function () {
        if (this.pageScrollAdjustHash && typeof this.pageScrollInstance.scrollTarget === 'string'
            && this.pageScrollInstance.scrollTarget.substr(0, 1) === '#') {
            // "Navigate" to the current route again and this time set the fragment/hash
            this.router.navigate([], {
                fragment: this.pageScrollInstance.scrollTarget.substr(1),
                preserveQueryParams: true
            });
        }
    };
    PageScroll.prototype.scroll = function () {
        var pageScrollInstance = this.generatePageScrollInstance();
        this.pushRouterState();
        this.pageScrollService.start(pageScrollInstance);
    };
    PageScroll.prototype.handleClick = function (clickEvent) {
        var _this = this;
        if (this.routerLink && this.router !== null && this.router !== undefined) {
            var urlTree = void 0;
            if (typeof this.routerLink === 'string') {
                urlTree = this.router.parseUrl(this.routerLink);
            }
            else {
                urlTree = this.router.createUrlTree(this.routerLink);
            }
            if (!this.router.isActive(urlTree, true)) {
                // We need to navigate their first.
                // Navigation is handled by the routerLink directive
                // so we only need to listen for route change
                var subscription_1 = this.router.events.subscribe(function (routerEvent) {
                    if (routerEvent instanceof router.NavigationEnd) {
                        subscription_1.unsubscribe();
                        // use a timeout to start scrolling as soon as the stack is cleared
                        setTimeout(function () {
                            _this.scroll();
                        }, 0);
                    }
                    else if (routerEvent instanceof router.NavigationError || routerEvent instanceof router.NavigationCancel) {
                        subscription_1.unsubscribe();
                    }
                });
                return false; // to preventDefault()
            }
        }
        this.scroll();
        return false; // to preventDefault()
    };
    PageScroll.decorators = [
        { type: core.Directive, args: [{
                    selector: '[pageScroll]',
                    host: {
                        '(click)': 'handleClick($event)',
                    }
                },] },
    ];
    /** @nocollapse */
    PageScroll.ctorParameters = function () { return [
        { type: PageScrollService, },
        { type: router.Router, decorators: [{ type: core.Optional },] },
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] },] },
    ]; };
    PageScroll.propDecorators = {
        'routerLink': [{ type: core.Input },],
        'href': [{ type: core.Input },],
        'pageScrollTarget': [{ type: core.Input },],
        'pageScrollHorizontal': [{ type: core.Input },],
        'pageScrollOffset': [{ type: core.Input },],
        'pageScrollDuration': [{ type: core.Input },],
        'pageScrollSpeed': [{ type: core.Input },],
        'pageScrollEasing': [{ type: core.Input },],
        'pageScrollInterruptible': [{ type: core.Input },],
        'pageScrollAdjustHash': [{ type: core.Input },],
        'pageScroll': [{ type: core.Input },],
        'pageScrollFinish': [{ type: core.Output },],
    };
    return PageScroll;
}());

var Ng2PageScrollModule = (function () {
    function Ng2PageScrollModule() {
    }
    /** @deprecated since v4.0.0-beta.10 (https://github.com/Nolanus/ng2-page-scroll/pull/190) */
    Ng2PageScrollModule.forRoot = function () {
        return {
            ngModule: Ng2PageScrollModule,
            providers: [
                { provide: PageScrollService, useClass: PageScrollService }
            ]
        };
    };
    Ng2PageScrollModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    declarations: [PageScroll],
                    exports: [PageScroll],
                    providers: [NG2PAGESCROLL_SERVICE_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    Ng2PageScrollModule.ctorParameters = function () { return []; };
    return Ng2PageScrollModule;
}());

exports.PageScroll = PageScroll;
exports.PageScrollService = PageScrollService;
exports.NG2PAGESCROLL_SERVICE_PROVIDER_FACTORY = NG2PAGESCROLL_SERVICE_PROVIDER_FACTORY;
exports.NG2PAGESCROLL_SERVICE_PROVIDER = NG2PAGESCROLL_SERVICE_PROVIDER;
exports.EasingLogic = EasingLogic;
exports.PageScrollConfig = PageScrollConfig;
exports.PageScrollInstance = PageScrollInstance;
exports.PageScrollUtilService = PageScrollUtilService;
exports.Ng2PageScrollModule = Ng2PageScrollModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
