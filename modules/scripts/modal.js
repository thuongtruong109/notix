// Base Modal Component - Reusable modal system
class Modal {
    constructor(options = {}) {
        this.id = options.id || 'base-modal'
        this.title = options.title || 'Modal'
        this.content = options.content || ''
        this.onClose = options.onClose || null
        this.modalElement = null
        this.isOpen = false

        this.init()
    }

    init() {
        // Check if modal already exists
        this.modalElement = document.getElementById(this.id)

        if (!this.modalElement) {
            this.create()
        }

        this.attachEvents()
    }

    create() {
        const modalHTML = `
            <div id="${this.id}" class="base-modal">
                <div class="base-modal__overlay"></div>
                <div class="base-modal__wrapper">
                    <div class="base-modal__header">
                        <h3 class="base-modal__title">${this.title}</h3>
                        <button class="base-modal__close" aria-label="Close modal">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="base-modal__divider"></div>
                    <div class="base-modal__content">${this.content}</div>
                </div>
            </div>
        `

        document.body.insertAdjacentHTML('beforeend', modalHTML)
        this.modalElement = document.getElementById(this.id)
    }

    attachEvents() {
        if (!this.modalElement) return

        const closeBtn = this.modalElement.querySelector('.base-modal__close')
        const overlay = this.modalElement.querySelector('.base-modal__overlay')

        if (closeBtn) {
            closeBtn.onclick = () => this.close()
        }

        if (overlay) {
            overlay.onclick = () => this.close()
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close()
            }
        })
    }

    open() {
        if (!this.modalElement) return

        this.modalElement.classList.add('active')
        this.isOpen = true
        document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    close() {
        if (!this.modalElement) return

        this.modalElement.classList.remove('active')
        this.isOpen = false
        document.body.style.overflow = '' // Restore scroll

        if (this.onClose) {
            this.onClose()
        }
    }

    setTitle(title) {
        this.title = title
        const titleElement =
            this.modalElement?.querySelector('.base-modal__title')
        if (titleElement) {
            titleElement.textContent = title
        }
    }

    setContent(content) {
        this.content = content
        const contentElement = this.modalElement?.querySelector(
            '.base-modal__content'
        )
        if (contentElement) {
            contentElement.innerHTML = content
        }
    }

    destroy() {
        if (this.modalElement) {
            this.modalElement.remove()
            this.modalElement = null
        }
        this.isOpen = false
        document.body.style.overflow = ''
    }
}

// Usage example:
// const myModal = new Modal({
//     id: 'my-modal',
//     title: 'My Title',
//     content: '<p>My content</p>',
//     onClose: () => console.log('Modal closed')
// })
// myModal.open()
