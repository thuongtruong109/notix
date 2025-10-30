let logo = document.getElementById('logo'),
    homeBtn = document.querySelector('#home'),
    main = document.querySelector('main'),
    header = document.querySelector('main > header'),
    noteHeader = document.querySelector('#note_header'),
    listHeader = document.querySelector('#list_header'),
    noteName = document.querySelector('#note_name'),
    total = document.querySelector('#total'),
    listPanel = document.querySelector('#list_panel'),
    notePanel = document.querySelector('#note_panel'),
    notePanelHeader = document.querySelector('.note_head_panel'),
    searchPanel = document.querySelector('#search_panel'),
    emptyImage = document.querySelector('#list_panel .empty_img'),
    notFoundImage = document.querySelector('#list_panel .not_found_img'),
    newAreaLine = document.querySelector(
        '#list_panel .empty_img #new_area_line'
    ),
    list = document.querySelector('#list_panel > ul'),
    listItem = document.querySelector('#list_panel > ul > li'),
    deleteBtn = document.querySelector('#list_header > #delete_btn'),
    newBtn = document.querySelector('#list_header > #new_btn'),
    searchBtn = document.querySelector('#list_header > #search_btn'),
    searchInput = document.querySelector(
        '#list_header > #search_panel > #search_input'
    ),
    searchCloseBtn = document.querySelector(
        '#list_header > #search_panel > #search_close_btn'
    ),
    noteInput = document.getElementById('note'),
    markdownPreview = document.getElementById('markdown_preview'),
    previewToggle = document.getElementById('preview_toggle'),
    settingsBtn = document.getElementById('settings_btn'),
    clearBtn = document.getElementById('clear'),
    copyLinkBtn = document.getElementById('copy_link'),
    captureBtn = document.getElementById('capture'),
    downloadImageBtn = document.getElementById('download_img'),
    downloadTextBtn = document.getElementById('download_text'),
    copyTextBtn = document.getElementById('copy_text'),
    saveBtn = document.getElementById('save'),
    images = document.querySelectorAll('#note_header > li > img'),
    noteInformation = document.getElementById('note_information'),
    voiceTextBtn = document.getElementById('voice_text'),
    audioTextBtn = document.getElementById('audio_text'),
    settings = document.getElementById('settings'),
    scrollToTopBtn = document.getElementById('scroll_to_top')

let isPreviewMode = false

const getEditorContent = () => {
    return noteInput.innerHTML
}

const setEditorContent = (content) => {
    noteInput.innerHTML = content
}

const getEditorText = () => {
    let html = noteInput.innerHTML

    html = html.replace(/<br\s*\/?>/gi, '\n')
    html = html.replace(/<\/div>/gi, '\n')
    html = html.replace(/<div>/gi, '')
    html = html.replace(/<[^>]+>/g, '')

    const textarea = document.createElement('textarea')
    textarea.innerHTML = html
    html = textarea.value

    return html
}

const clearEditor = () => {
    noteInput.innerHTML = ''
}

const appendToEditor = (text) => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(text)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
    } else {
        noteInput.appendChild(document.createTextNode(text))
    }
}

const saveCursorPosition = () => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(noteInput)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    const caretOffset = preCaretRange.toString().length

    return caretOffset
}

const restoreCursorPosition = (caretOffset) => {
    if (caretOffset == null) return

    const selection = window.getSelection()
    const range = document.createRange()

    let currentOffset = 0
    let found = false

    const traverseNodes = (node) => {
        if (found) return

        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length
            if (currentOffset + nodeLength >= caretOffset) {
                range.setStart(node, caretOffset - currentOffset)
                range.setEnd(node, caretOffset - currentOffset)
                found = true
                return
            }
            currentOffset += nodeLength
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                traverseNodes(child)
                if (found) return
            }
        }
    }

    traverseNodes(noteInput)

    if (found) {
        selection.removeAllRanges()
        selection.addRange(range)
    }
}

const tabListStyle = () => {
    listHeader.style.display = 'flex'
    noteHeader.style.display = 'none'
    notePanel.style.display = 'none'
    listPanel.style.display = 'flex'
    logo.style.display = 'flex'
    homeBtn.style.display = 'none'
    noteName.style.display = 'none'
    notePanelHeader.style.display = 'none'
}

const tabNoteStyle = () => {
    listHeader.style.display = 'none'
    noteHeader.style.display = 'flex'
    notePanel.style.display = 'flex'
    listPanel.style.display = 'none'
    logo.style.display = 'none'
    homeBtn.style.display = 'block'
    noteName.style.display = 'inline-flex'
    notePanelHeader.style.display = 'flex'
}

const dynamicImport = async (path) => {
    let src = chrome.runtime.getURL(path)
    return await import(src)
}

;(async () => {
    const contentVariables = await dynamicImport(
        './modules/scripts/variables.js'
    )
    let ICONS = contentVariables.ICONS
    let OBJ_KEYS = contentVariables.OBJ_KEYS

    const contentHelpers = await dynamicImport('./modules/scripts/helpers.js')
    let calLastUpdate = contentHelpers.calLastUpdate
    let exportToImage = contentHelpers.exportToImage

    const contentMarkdown = await dynamicImport('./modules/scripts/markdown.js')
    let parseMarkdown = contentMarkdown.parseMarkdown

    const contentStorage = await dynamicImport('./modules/scripts/storage.js')
    let loadTab = contentStorage.loadTab
    let dispatchTab = contentStorage.dispatchTab

    let loadNotes = contentStorage.loadNotes
    let dispatchNotes = contentStorage.dispatchNotes

    let loadCurrentNote = contentStorage.loadCurrentNote
    let dispatchCurrentNote = contentStorage.dispatchCurrentNote

    let loadAutoSettings = contentStorage.loadAutoSettings
    let loadAudioSettings = contentStorage.loadAudioSettings
    let onStorageChanged = contentStorage.onStorageChanged
    let onSyncMessage = contentStorage.onSyncMessage

    const persistCurrentTabStyle = (tab) => {
        tab === OBJ_KEYS.NOTE ? tabNoteStyle() : tabListStyle()
    }

    const changeTab = (tab) => {
        persistCurrentTabStyle(tab)
        dispatchTab(tab)
    }

    loadTab((data) => persistCurrentTabStyle(data.tab))

    let isAutoSave = true
    let isAutoSync = true
    let isLocalSaving = false
    let audioSettings = {
        voice: '0',
        vol: '1',
        pitch: '1',
        rate: '1',
    }

    loadAutoSettings((data) => {
        if (data.auto_settings) {
            isAutoSave = data.auto_settings.autoSave
            isAutoSync =
                data.auto_settings.autoSync !== undefined
                    ? data.auto_settings.autoSync
                    : true // default is true
        }
    })

    // **************** Sync data between tabs ****************

    onStorageChanged((changes) => {
        if (changes[OBJ_KEYS.AUTO_SETTINGS]) {
            const newSettings = changes[OBJ_KEYS.AUTO_SETTINGS].newValue
            if (newSettings) {
                isAutoSave = newSettings.autoSave
                isAutoSync =
                    newSettings.autoSync !== undefined
                        ? newSettings.autoSync
                        : true
            }
        }

        if (!isAutoSync) return

        if (changes[OBJ_KEYS.ITEMS]) {
            loadNotesList()

            if (changes[OBJ_KEYS.ITEMS].newValue && currentNoteData.id) {
                const updatedNote = changes[OBJ_KEYS.ITEMS].newValue.find(
                    (item) => item.id === currentNoteData.id
                )
                if (
                    updatedNote &&
                    updatedNote.title !== currentNoteData.title
                ) {
                    currentNoteData.title = updatedNote.title
                    noteName.innerText = updatedNote.title
                    currentExportName = `notix_${updatedNote.title}`
                }
            }
        }

        if (changes[OBJ_KEYS.CURRENT_DATA]) {
            if (isLocalSaving) return
            loadCurrentNoteData(true)
        }
    })

    onSyncMessage((changes) => {
        console.log('Sync message received:', changes)

        if (changes[OBJ_KEYS.AUTO_SETTINGS]) {
            const newSettings = changes[OBJ_KEYS.AUTO_SETTINGS].newValue
            if (newSettings) {
                isAutoSave = newSettings.autoSave
                isAutoSync =
                    newSettings.autoSync !== undefined
                        ? newSettings.autoSync
                        : true
            }
        }

        if (!isAutoSync) return

        if (changes[OBJ_KEYS.ITEMS]) {
            console.log('Reloading notes list due to sync message')
            loadNotesList()

            if (changes[OBJ_KEYS.ITEMS].newValue && currentNoteData.id) {
                const updatedNote = changes[OBJ_KEYS.ITEMS].newValue.find(
                    (item) => item.id === currentNoteData.id
                )
                if (
                    updatedNote &&
                    updatedNote.title !== currentNoteData.title
                ) {
                    console.log(
                        'Current note title changed via sync message, updating display'
                    )
                    currentNoteData.title = updatedNote.title
                    noteName.innerText = updatedNote.title
                    currentExportName = `notix_${updatedNote.title}`
                }
            }
        }

        if (changes[OBJ_KEYS.CURRENT_DATA]) {
            console.log('Reloading current note due to sync message')
            if (isLocalSaving) return
            loadCurrentNoteData(true)
        }
    })

    // **************** list tab ****************

    let notesList = []
    let removesList = []
    let notesLoadVersion = 0

    const dispatchNotesList = () => dispatchNotes(notesList)

    const listApperanceStyle = () => {
        if (notesList.length > 0) {
            emptyImage.classList.remove(OBJ_KEYS.ACTIVE_CLASS)
            list.classList.remove('inactive')
            searchBtn.style.display = 'flex'
        } else {
            emptyImage.classList.add(OBJ_KEYS.ACTIVE_CLASS)
            list.classList.add('inactive')
            deleteBtn.style.display = 'none'
            searchBtn.style.display = 'none'
        }
    }

    const deleteSelectedNotes = () => {
        if (removesList.length > 0) {
            deleteBtn.classList.remove('disabled')
            deleteBtn.style.display = 'flex'
        } else {
            deleteBtn.classList.add('disabled')
            deleteBtn.style.display = 'none'
        }

        deleteBtn.onclick = () => {
            for (let currentSelect of removesList) {
                list.removeChild(document.getElementById(currentSelect))
                notesList = notesList.filter(
                    (currentItem) => currentItem.id !== currentSelect
                )
            }
            removesList = []
            dispatchNotesList()
            loadNotesList()
        }
    }

    const updateNoteById = () => {
        notesList.map((item, index) => {
            if (item.id === currentNoteData.id) {
                notesList[index] = currentNoteData
            }
        })

        dispatchNotesList()
    }

    const createNewNote = (id, title) => {
        let newItem = document.createElement('li')
        newItem.setAttribute('id', id)

        let titleBtn = document.createElement('button')
        titleBtn.setAttribute('type', 'button')

        let titleBtnSpan = document.createElement('span')
        titleBtnSpan.classList.add('note_title')
        titleBtnSpan.innerText = title

        titleBtnSpan.onclick = async () => {
            let choice = await notesList.find((item) => item.id === id)
            chrome.storage.sync.set({ current_data: choice })
            loadCurrentNoteData()
            changeTab(OBJ_KEYS.NOTE)
            if (!isPreviewMode) {
                setTimeout(() => {
                    togglePreview()
                }, 50)
            }
        }

        titleBtn.appendChild(titleBtnSpan)

        let editBtn = document.createElement('img')
        editBtn.setAttribute('src', ICONS.EDIT_STATE)
        editBtn.classList.add('edit_btn')
        editBtn.setAttribute('title', 'edit')
        titleBtn.appendChild(editBtn)

        editBtn.onclick = () => {
            titleBtn.innerHTML = ''
            newItem.classList.add('choiced')

            let titleEditInput = document.createElement('input')
            titleEditInput.setAttribute('type', 'text')
            titleEditInput.setAttribute('maxlength', '50')
            titleEditInput.setAttribute('required', 'true')
            titleEditInput.classList.add('note_title')
            titleEditInput.value = title
            titleEditInput.setAttribute('title', 'edit')
            titleEditInput.style.cursor = 'auto'
            titleBtn.appendChild(titleEditInput)
            titleEditInput.focus()

            let titleCancelEditBtn = document.createElement('img')
            titleCancelEditBtn.setAttribute('src', ICONS.CANCEL_STATE)
            titleCancelEditBtn.classList.add('cancel_btn')
            titleCancelEditBtn.setAttribute('title', 'cancel')
            titleBtn.appendChild(titleCancelEditBtn)

            const cancelEdit = () => {
                titleEditInput.replaceWith(titleBtnSpan)
                titleEditDoneBtn.replaceWith(editBtn)
                titleEditInput.remove()
                titleEditDoneBtn.remove()
                titleCancelEditBtn.remove()
                newItem.classList.remove('choiced')
            }

            titleCancelEditBtn.onclick = () => {
                cancelEdit()
            }

            let titleEditDoneBtn = document.createElement('img')
            titleEditDoneBtn.setAttribute('src', ICONS.SAVE_STATE)
            titleEditDoneBtn.classList.add('edit_btn')
            titleEditDoneBtn.setAttribute('title', 'done')
            titleBtn.appendChild(titleEditDoneBtn)

            titleEditDoneBtn.onclick = async () => {
                title = titleEditInput.value
                titleBtnSpan.innerText = title
                notesList.map((item, index) => {
                    if (item.id === id) {
                        notesList[index].title = title
                    }
                })

                await new Promise((resolve) => {
                    dispatchNotesList(resolve)
                })

                cancelEdit()
            }
        }

        newItem.appendChild(titleBtn)

        let checkboxItem = document.createElement('input')
        checkboxItem.setAttribute('type', 'checkbox')
        checkboxItem.classList.add('checkbox_item')
        checkboxItem.setAttribute('id', `checkbox_item_${id}`)
        checkboxItem.setAttribute('title', 'select')
        newItem.appendChild(checkboxItem)

        let checkboxEffect = document.createElement('label')
        checkboxEffect.setAttribute('for', `checkbox_item_${id}`)
        newItem.appendChild(checkboxEffect)

        checkboxItem.onclick = () => {
            if (checkboxItem.checked === true) {
                removesList.push(id)
            } else {
                removesList = removesList.filter(
                    (currentItem) => currentItem !== id
                )
            }

            deleteSelectedNotes()
        }

        listApperanceStyle()

        return newItem
    }

    const loadNotesList = async () => {
        notesLoadVersion += 1
        const thisVersion = notesLoadVersion

        list.innerHTML = ''

        await new Promise((resolve) => {
            loadNotes((data) => {
                if (thisVersion !== notesLoadVersion) {
                    resolve()
                    return
                }

                if (data && data.items && Array.isArray(data.items)) {
                    for (let item of data.items) {
                        list.appendChild(createNewNote(item.id, item.title))
                    }
                    notesList = data.items
                    total.innerText = notesList.length
                } else {
                    notesList = []
                    total.innerText = 0
                }

                listApperanceStyle()
                resolve()
            })
        })
    }

    loadNotesList()

    const createNew = () => {
        let newData = {
            id: Date.now(),
            title: `New note ${Date.now()}`,
            content: '',
            lastUpdate: Date.now(),
        }

        notesList.push(newData)
        dispatchNotesList()

        list.appendChild(createNewNote(newData.id, newData.title))
    }

    newBtn.onclick = () => {
        createNew()
    }

    newAreaLine.onclick = () => {
        createNew()
    }

    searchBtn.onclick = () => {
        searchPanel.classList.add(OBJ_KEYS.ACTIVE_CLASS)
        searchInput.focus()

        searchCloseBtn.onclick = () => {
            searchInput.value = ''
            searchPanel.classList.remove(OBJ_KEYS.ACTIVE_CLASS)
            loadNotesList()
            notFoundImage.classList.remove(OBJ_KEYS.ACTIVE_CLASS)
        }

        searchInput.oninput = () => {
            let searchValue = searchInput.value.toLowerCase()
            let searchList = notesList.filter((item) =>
                item.title.toLowerCase().includes(searchValue)
            )
            list.innerHTML = ''

            for (let item of searchList) {
                list.appendChild(createNewNote(item.id, item.title))
            }

            if (searchList.length === 0) {
                notFoundImage.classList.add(OBJ_KEYS.ACTIVE_CLASS)
                list.classList.add('inactive')
            } else {
                notFoundImage.classList.remove(OBJ_KEYS.ACTIVE_CLASS)
                list.classList.remove('inactive')
            }
        }
    }

    // **************** note tab ****************

    let currentNoteData = {
        id: '',
        title: '',
        content: '',
        lastUpdate: '',
    }

    let currentExportName = ''

    const loadCurrentNoteData = (preserveCursor = false) => {
        const savedCursor = preserveCursor ? saveCursorPosition() : null

        loadCurrentNote((data) => {
            if (data.current_data) {
                setEditorContent(data.current_data.content)
                currentNoteData = data.current_data
                noteName.innerText = data.current_data.title
                currentExportName = `notix_${data.current_data.title}`

                if (preserveCursor && savedCursor != null) {
                    setTimeout(() => {
                        restoreCursorPosition(savedCursor)
                    }, 0)
                }
            }
        })
    }

    loadCurrentNoteData()

    let noteEyeIcon = document.getElementById('note_eye_icon')
    if (noteEyeIcon) {
        if (!isPreviewMode) {
            noteEyeIcon.src = ICONS.EDIT_STATE
            noteEyeIcon.title = 'Edit Mode - Click to Preview'
        }

        noteEyeIcon.onclick = () => {
            if (!currentNoteData || !currentNoteData.id) return
            togglePreview()
        }
    }

    const enableInlineRename = () => {
        if (!currentNoteData.id) return

        let noteNameInput = document.createElement('input')
        noteNameInput.setAttribute('type', 'text')
        noteNameInput.setAttribute('maxlength', '50')
        noteNameInput.setAttribute('required', 'true')
        noteNameInput.value = currentNoteData.title
        noteNameInput.style.cssText = `
            background: transparent;
            border: none;
            padding: 0;
            margin: 0;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            outline: none;
            width: 100%;
            cursor: text;
        `

        noteName.innerHTML = ''
        noteName.appendChild(noteNameInput)
        noteNameInput.focus()

        const saveRename = async () => {
            let newTitle = noteNameInput.value.trim()
            if (!newTitle) {
                newTitle = currentNoteData.title
            }

            currentNoteData.title = newTitle
            currentExportName = `notix_${newTitle}`

            notesList = notesList.map((item) =>
                item.id === currentNoteData.id
                    ? { ...item, title: newTitle }
                    : item
            )

            await new Promise((resolve) => {
                dispatchNotesList(resolve)
            })

            dispatchCurrentNote(currentNoteData)

            noteName.innerHTML = ''
            noteName.innerText = newTitle
        }

        const cancelRename = () => {
            noteName.innerHTML = ''
            noteName.innerText = currentNoteData.title
        }

        noteNameInput.addEventListener('blur', saveRename)
        noteNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                noteNameInput.blur()
            } else if (e.key === 'Escape') {
                e.preventDefault()
                cancelRename()
            }
        })
    }

    noteName.addEventListener('click', enableInlineRename)

    notePanel.addEventListener('load', () => {
        noteInput.scrollTop = noteInput.scrollHeight
    })

    homeBtn.onclick = () => {
        changeTab(OBJ_KEYS.LIST)
    }

    settingsBtn.onclick = () => {
        settings.classList.add(OBJ_KEYS.ACTIVE_CLASS)
    }

    const saveData = () => {
        currentNoteData.content = getEditorContent()
        currentNoteData.lastUpdate = Date.now()

        dispatchCurrentNote(currentNoteData, () => {
            updateNoteById()

            images[7].src = ICONS.DONE_STATE
            images[7].title = 'saved'

            setTimeout(() => {
                images[7].src = ICONS.SAVE_STATE
                images[7].title = 'save'
            }, 2000)
        })
    }

    saveBtn.onclick = () => {
        saveData()
    }

    const autoSave = async () => {
        await loadAutoSettings((data) => {
            if (data.auto_settings) {
                isAutoSave = data.auto_settings.autoSave
            }
        })
    }

    autoSave()

    let autoSaveTimeout = null

    noteInput.addEventListener('input', async () => {
        await autoSave()
        if (isAutoSave) {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout)
            }

            autoSaveTimeout = setTimeout(() => {
                isLocalSaving = true
                saveData()
                setTimeout(() => {
                    isLocalSaving = false
                }, 100)
            }, 1000)
        }

        if (isPreviewMode) {
            updateMarkdownPreview()
        }
    })

    // **************** Markdown Preview ****************

    const updateMarkdownPreview = () => {
        if (markdownPreview && noteInput) {
            const markdownContent = getEditorText()
            const htmlContent = parseMarkdown(markdownContent)
            markdownPreview.innerHTML = htmlContent

            // Add/remove empty class for placeholder styling
            if (!markdownContent.trim()) {
                markdownPreview.classList.add('empty')
            } else {
                markdownPreview.classList.remove('empty')
            }
        }
    }

    let savedCursorBeforePreview = null

    const showModeToast = (mode) => {
        const existingToast = document.querySelector('.mode-toast')
        if (existingToast) {
            existingToast.remove()
        }

        const toast = document.createElement('div')
        toast.className = `mode-toast ${
            mode === 'preview' ? 'preview-mode' : 'edit-mode'
        }`

        // Add shift-left class if scroll button is visible
        if (scrollToTopBtn && scrollToTopBtn.classList.contains('show')) {
            toast.classList.add('shift-left')
        }

        toast.textContent = mode === 'preview' ? 'Preview Mode' : 'Edit Mode'

        // Append to the inner div container, not note_panel itself
        const noteContainer = document.querySelector('#note_panel > div')
        noteContainer.appendChild(toast)

        setTimeout(() => {
            toast.classList.add('show')
        }, 10)

        setTimeout(() => {
            toast.classList.remove('show')
            setTimeout(() => {
                toast.remove()
            }, 300)
        }, 1000)
    }

    const togglePreview = () => {
        isPreviewMode = !isPreviewMode

        if (isPreviewMode) {
            savedCursorBeforePreview = saveCursorPosition()
            noteInput.style.display = 'none'
            markdownPreview.style.display = 'block'
            markdownPreview.classList.add('preview-active')
            updateMarkdownPreview()
            if (previewToggle) previewToggle.classList.add('active')
            if (noteEyeIcon) {
                noteEyeIcon.classList.add('active')
                noteEyeIcon.src = ICONS.PREVIEW_STATE
                noteEyeIcon.title = 'Preview Mode - Click to Edit'
            }
            showModeToast('preview')
        } else {
            noteInput.style.display = 'block'
            markdownPreview.style.display = 'none'
            markdownPreview.classList.remove('preview-active')
            if (previewToggle) previewToggle.classList.remove('active')
            if (noteEyeIcon) {
                noteEyeIcon.classList.remove('active')
                noteEyeIcon.src = ICONS.EDIT_STATE
                noteEyeIcon.title = 'Edit Mode - Click to Preview'
            }

            if (savedCursorBeforePreview != null) {
                setTimeout(() => {
                    restoreCursorPosition(savedCursorBeforePreview)
                    noteInput.focus()
                }, 0)
            } else {
                noteInput.focus()
            }
            showModeToast('edit')
        }
    }

    markdownPreview.onclick = () => {
        if (isPreviewMode) {
            togglePreview()
        }
    }

    if (previewToggle) {
        previewToggle.onclick = () => {
            togglePreview()
        }
    }

    markdownPreview.style.display = 'none'

    // **************** Clear & Export ****************

    clearBtn.onclick = () => {
        chrome.storage.sync.remove(OBJ_KEYS.CURRENT_DATA, () => {
            clearEditor()
            currentNoteData.content = ''
            currentNoteData.lastUpdate = Date.now()
            updateNoteById()
            images[1].src = ICONS.DONE_STATE
        })
    }

    downloadTextBtn.onclick = () => {
        var element = document.createElement('a')
        element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' +
                encodeURIComponent(getEditorText())
        )
        element.setAttribute('download', `${currentExportName}.txt`)

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
        images[5].src = ICONS.DONE_STATE
        images[5].title = 'downloaded text'
    }

    copyTextBtn.onclick = () => {
        let note = noteInput.innerText || noteInput.textContent
        navigator.clipboard.writeText(note).then(
            () => {
                images[6].src = ICONS.DONE_STATE
                images[6].title = 'copied text'
            },
            () => {
                alert('Error when copying to clipboard')
            }
        )
    }

    copyLinkBtn.onclick = () => {
        header.style.display = 'none'
        notePanelHeader.style.display = 'none'
        exportToImage(async (dataUrl) => {
            navigator.clipboard.writeText(dataUrl).then(
                () => {
                    header.style.display = 'flex'
                    notePanelHeader.style.display = 'flex'
                    images[2].src = ICONS.DONE_STATE
                    images[2].title = 'copied link'
                },
                () => {
                    alert('Error when copying to clipboard')
                }
            )
        })
    }

    captureBtn.onclick = async () => {
        header.style.display = 'none'
        notePanelHeader.style.display = 'none'

        exportToImage(async (dataUrl) => {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': await fetch(dataUrl).then((r) => r.blob()),
                }),
            ])

            header.style.display = 'flex'
            notePanelHeader.style.display = 'flex'
            images[3].src = ICONS.DONE_STATE
            images[3].title = 'copied screenshot capture'
        })
    }

    downloadImageBtn.onclick = async () => {
        header.style.display = 'none'
        notePanelHeader.style.display = 'none'

        exportToImage(async (dataUrl) => {
            var element = document.createElement('a')
            element.setAttribute('href', dataUrl)
            element.setAttribute('download', `${currentExportName}.png`)
            element.style.display = 'none'
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)

            header.style.display = 'flex'
            notePanelHeader.style.display = 'flex'
            images[4].src = ICONS.DONE_STATE
            images[4].title = 'downloaded image'
        })
    }

    // ========== Note Information Modal ==========
    let statsModal = null

    const initStatsModal = () => {
        if (!statsModal) {
            statsModal = new Modal({
                id: 'stats-modal',
                title: 'Note Statistics',
                content: '',
            })
        }
    }

    noteInformation.onclick = async () => {
        initStatsModal()

        const editorText = getEditorText()
        const editorContent = getEditorContent()

        const totalLines = editorText === '' ? 0 : editorText.split('\n').length

        const words = editorText
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0)
        const totalWords = editorText.trim() === '' ? 0 : words.length

        const totalChars = editorText.length

        const totalSize = (new Blob([editorText]).size / 1024).toFixed(2)

        const lastUpdate = calLastUpdate(currentNoteData.lastUpdate)

        const content = `
            <ul>
                <li>
                    <span>Lines</span>
                    <span>${totalLines}</span>
                </li>
                <li>
                    <span>Words</span>
                    <span>${totalWords}</span>
                </li>
                <li>
                    <span>Characters</span>
                    <span>${totalChars}</span>
                </li>
                <li>
                    <span>Size</span>
                    <span>${totalSize} KB</span>
                </li>
                <li>
                    <span>Last Updated</span>
                    <span>${lastUpdate}</span>
                </li>
            </ul>
        `

        statsModal.setContent(content)
        statsModal.open()
    }

    // audio text
    let isAudioReading = false
    let msg = new SpeechSynthesisUtterance()

    const loadAudioSettingsData = async () => {
        await loadAudioSettings((data) => {
            if (data.audio_settings) {
                audioSettings = data.audio_settings
            }
        })
    }

    loadAudioSettingsData()

    const turnOffAudio = () => {
        speechSynthesis.cancel()
        isAudioReading = false
        audioTextBtn.src = ICONS.MUTE_STATE
        audioTextBtn.title = 'muted audio'
    }

    const turnOnAudio = () => {
        if ('speechSynthesis' in window) {
            isAudioReading = true
            audioTextBtn.src = ICONS.AUDIO_STATE
            audioTextBtn.title = 'audio text'
            msg.voice = speechSynthesis.getVoices()[audioSettings.voice]
            msg.text = getEditorText()
            msg.volume = audioSettings.vol
            msg.pitch = audioSettings.pitch
            msg.rate = audioSettings.rate
            speechSynthesis.speak(msg)
            return false
        }
    }

    audioTextBtn.onclick = async () => {
        await loadAudioSettingsData()
        isAudioReading ? turnOffAudio() : turnOnAudio()
    }

    // voice recognition
    voiceTextBtn.onclick = () => {
        var permission = navigator.permissions.query({ name: 'microphone' })
        permission.then((permissionStatus) => {
            if (permissionStatus.state == 'granted') {
                navigator.mediaDevices
                    .getUserMedia({ audio: true })
                    .then(() => {
                        // var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
                        // var recognition = new SpeechRecognition();

                        let recognition = new (window.SpeechRecognition ||
                            window.webkitSpeechRecognition)()

                        recognition.continuous = true
                        recognition.interimResults = true

                        recognition.onresult = (event) => {
                            const result =
                                event.results[event.resultIndex][0].transcript
                            appendToEditor(result)
                        }

                        // recognition.onresult = function(event) {
                        //     var transcript = event.results[0][0].transcript;
                        //     output.innerHTML = "<b>Text:</b> " + transcript;
                        // };

                        // recognition.onspeechend = function() {
                        //     action.innerHTML = "<small>stopped listening, hope you are done...</small>";
                        //     recognition.stop();
                        // }

                        recognition.onerror = (event) => {
                            alert(
                                'Speech recognition error. Please try again.',
                                event.error
                            )
                        }

                        recognition.start()
                        voiceTextBtn.src = ICONS.RECORDING_STATE
                        voiceTextBtn.title = 'recording'
                        appendToEditor(' ')

                        voiceTextBtn.onclick = () => {
                            recognition.stop()
                            saveData()
                            voiceTextBtn.src = ICONS.VOICE_STATE
                            voiceTextBtn.title = 'voice to text'
                        }
                    })
                    .catch((error) => {
                        console.error('Error accessing the microphone:', error)
                    })
            } else {
                const enableMicString =
                    'Microphone access denied. Please allow microphone access in your browser settings.\n\n* Step 1: Right click on the Notix extension icon\n* Step 2: Choose View web permission option\n* Step 3: Change microphone selection to Allow'
                alert(enableMicString)
            }
        })
    }
})()

// Scroll to top functionality
;(() => {
    if (!scrollToTopBtn) return

    // Get the scrollable element (noteInput or markdownPreview depending on mode)
    const getScrollableElement = () => {
        return isPreviewMode ? markdownPreview : noteInput
    }

    // Show/hide scroll to top button based on scroll position
    const handleScroll = () => {
        const scrollableElement = getScrollableElement()
        // Reduced threshold to 100px for better visibility in extension popup
        if (scrollableElement && scrollableElement.scrollTop > 50) {
            scrollToTopBtn.classList.add('show')
        } else {
            scrollToTopBtn.classList.remove('show')
        }
    }

    // Scroll to top smoothly
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const scrollableElement = getScrollableElement()
        if (scrollableElement) {
            scrollableElement.scrollTop = 0
        }
    })

    // Add scroll event listeners to both note input and markdown preview
    noteInput.addEventListener('scroll', handleScroll)
    markdownPreview.addEventListener('scroll', handleScroll)

    // Initial check
    handleScroll()
})()
