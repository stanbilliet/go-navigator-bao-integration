export class NavigatorSelector {

    constructor() {
        this.origin = 'https://g-o.smartschool.be';

        this.baseUrl =
            this.origin + '/navigator-bao/selector/basisonderwijs';

        this.windowRef = null;

        // Callbacks exposed to the consuming application
        this.onReady = null;
        this.onSave = null;
        this.onClose = null;

        // Bind the event handler so it can be removed later
        this.handleMessage = this.handleMessage.bind(this);

        window.addEventListener(
            'message',
            this.handleMessage
        );
    }


    open(options) {
        if (options === undefined || options === null) {
            options = {};
        }

        var url = new URL(this.baseUrl);

        // Optionally open a specific curriculum
        if (options.curriculumId !== undefined &&
            options.curriculumId !== null &&
            options.curriculumId !== '') {

            url.searchParams.set(
                'curriculumId',
                options.curriculumId
            );
        }

        // Optionally open a specific curriculum item
        if (options.curriculumItemId !== undefined &&
            options.curriculumItemId !== null &&
            options.curriculumItemId !== '') {

            url.searchParams.set(
                'curriculumItemId',
                options.curriculumItemId
            );
        }

        this.windowRef = window.open(
            url.toString(),
            'navigator_bao_selector',
            'width=1200,height=850,resizable=yes,scrollbars=yes'
        );
    }


    handleMessage(event) {

        // Ignore messages coming from another origin
        if (event.origin !== this.origin) {
            return;
        }

        var message = event.data;

        if (message === null || message === undefined) {
            return;
        }

        switch (message.type) {

            case 'ready':
                this.handleReady();
                break;

            case 'save':
                this.handleSave(message);
                break;

            case 'close':
                this.handleClose();
                break;
        }
    }


    handleReady() {
        if (this.onReady !== null) {
            this.onReady();
        }
    }


    handleSave(message) {
        var selection = null;

        if (message.data !== null &&
            message.data !== undefined) {

            selection = message.data.selection;
        }

        if (this.onSave !== null) {
            this.onSave(selection);
        }
    }


    handleClose() {
        if (this.onClose !== null) {
            this.onClose();
        }
    }


    setSelection(selection) {
        if (this.windowRef === null) {
            return;
        }

        var message = {
            type: 'setSelection',
            data: {
                selection: selection
            }
        };

        this.windowRef.postMessage(
            message,
            this.origin
        );
    }


    dispose() {
        window.removeEventListener(
            'message',
            this.handleMessage
        );

        this.windowRef = null;
    }
}