import { Directive, Input, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { Router, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from './ng2-page-scroll.service';
import { PageScrollInstance } from './ng2-page-scroll-instance';
import { PageScrollUtilService as Util } from './ng2-page-scroll-util.service';
var PageScroll = (function () {
    function PageScroll(pageScrollService, router, document) {
        this.pageScrollService = pageScrollService;
        this.router = router;
        this.pageScrollTarget = null;
        this.pageScrollHorizontal = null;
        this.pageScrollOffset = null;
        this.pageScrollDuration = null;
        this.pageScrollSpeed = null;
        this.pageScrollEasing = null;
        this.pageScrollAdjustHash = false;
        this.pageScroll = null;
        this.pageScrollFinish = new EventEmitter();
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
        if (Util.isUndefinedOrNull(this.pageScrollInstance)) {
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
                    if (routerEvent instanceof NavigationEnd) {
                        subscription_1.unsubscribe();
                        // use a timeout to start scrolling as soon as the stack is cleared
                        setTimeout(function () {
                            _this.scroll();
                        }, 0);
                    }
                    else if (routerEvent instanceof NavigationError || routerEvent instanceof NavigationCancel) {
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
        { type: Directive, args: [{
                    selector: '[pageScroll]',
                    host: {
                        '(click)': 'handleClick($event)',
                    }
                },] },
    ];
    /** @nocollapse */
    PageScroll.ctorParameters = function () { return [
        { type: PageScrollService, },
        { type: Router, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    ]; };
    PageScroll.propDecorators = {
        'routerLink': [{ type: Input },],
        'href': [{ type: Input },],
        'pageScrollTarget': [{ type: Input },],
        'pageScrollHorizontal': [{ type: Input },],
        'pageScrollOffset': [{ type: Input },],
        'pageScrollDuration': [{ type: Input },],
        'pageScrollSpeed': [{ type: Input },],
        'pageScrollEasing': [{ type: Input },],
        'pageScrollInterruptible': [{ type: Input },],
        'pageScrollAdjustHash': [{ type: Input },],
        'pageScroll': [{ type: Input },],
        'pageScrollFinish': [{ type: Output },],
    };
    return PageScroll;
}());
export { PageScroll };
