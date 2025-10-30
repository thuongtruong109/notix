let closeBtn = document.querySelector('#settings #close_settings')

closeBtn.addEventListener('click', () => {
    let settings = document.getElementById('settings')
    settings.classList.remove('active')
})

// audio
let hvoice = document.getElementById('voice'),
    hvol = document.getElementById('audio_setting_volumn'),
    hpitch = document.getElementById('audio_setting_pitch'),
    hrate = document.getElementById('audio_setting_rate')

// Custom dropdown elements
const customSelect = document.getElementById('voice-select')
const customSelectTrigger = customSelect?.querySelector(
    '.custom-select__trigger span'
)
const customOptions = customSelect?.querySelector('.custom-options')

let audioSettings = {
    voice: '0',
    vol: '1',
    pitch: '1',
    rate: '1',
}

if ('speechSynthesis' in window) {
    const dispatchAudioSettings = () => {
        chrome.storage.sync.set({ audio_settings: audioSettings })
    }

    chrome.storage.sync.get('audio_settings', (res) => {
        if (res.audio_settings) {
            audioSettings = res.audio_settings
            hvoice.value = audioSettings.voice
            hvol.value = audioSettings.vol
            hpitch.value = audioSettings.pitch
            hrate.value = audioSettings.rate

            // Update custom dropdown display
            if (customSelectTrigger && hvoice.options[audioSettings.voice]) {
                customSelectTrigger.textContent =
                    hvoice.options[audioSettings.voice].text
            }
        }
    })

    let voices = () => {
        const voiceList = speechSynthesis.getVoices()

        voiceList.forEach((v, i) => {
            // Populate hidden select
            let opt = document.createElement('option')
            opt.value = i
            opt.innerHTML = v.name
            hvoice.appendChild(opt)

            // Populate custom dropdown
            if (customOptions) {
                const customOption = document.createElement('div')
                customOption.classList.add('custom-option')
                customOption.setAttribute('data-value', i)

                // Add voice name
                const voiceName = document.createElement('span')
                voiceName.classList.add('custom-option__name')
                voiceName.textContent = v.name

                // Add language tag
                const voiceLang = document.createElement('span')
                voiceLang.classList.add('custom-option__lang')
                voiceLang.textContent = v.lang

                customOption.appendChild(voiceName)
                customOption.appendChild(voiceLang)

                // Click handler
                customOption.addEventListener('click', () => {
                    // Update hidden select
                    hvoice.value = i
                    audioSettings.voice = i

                    // Update display
                    if (customSelectTrigger) {
                        customSelectTrigger.textContent = v.name
                    }

                    // Remove active class from all options
                    customOptions
                        .querySelectorAll('.custom-option')
                        .forEach((opt) => {
                            opt.classList.remove('active')
                        })

                    // Add active class to selected
                    customOption.classList.add('active')

                    // Close dropdown
                    customSelect.classList.remove('open')

                    dispatchAudioSettings()
                })

                // Set active if it's the current selection
                if (i == audioSettings.voice) {
                    customOption.classList.add('active')
                    if (customSelectTrigger) {
                        customSelectTrigger.textContent = v.name
                    }
                }

                customOptions.appendChild(customOption)
            }
        })
    }

    voices()
    speechSynthesis.onvoiceschanged = voices

    // Custom dropdown toggle
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select__trigger')

        trigger.addEventListener('click', (e) => {
            e.stopPropagation()
            customSelect.classList.toggle('open')
        })

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open')
            }
        })
    }

    hvoice.addEventListener('change', () => {
        hvoice.value = hvoice.selectedIndex
        audioSettings.voice = hvoice.value
        dispatchAudioSettings()
    })

    hvol.addEventListener('mouseup', () => {
        audioSettings.vol = hvol.value
        dispatchAudioSettings()
    })

    hpitch.addEventListener('mouseup', () => {
        audioSettings.pitch = hpitch.value
        dispatchAudioSettings()
    })

    hrate.addEventListener('mouseup', () => {
        audioSettings.rate = hrate.value
        dispatchAudioSettings()
    })
}

// others
let autoSaveBtn = document.getElementById('autosave_setting_toggle')
let autoSyncBtn = document.getElementById('autosync_setting_toggle')

let autoSettings = {
    autoSave: true,
    autoSync: true,
}

const dispatchAutoSettings = () => {
    chrome.storage.sync.set({ auto_settings: autoSettings })
}

chrome.storage.sync.get('auto_settings', (res) => {
    if (res.auto_settings) {
        autoSettings = res.auto_settings
        autoSaveBtn.checked = autoSettings.autoSave
        autoSyncBtn.checked = autoSettings.autoSync
    }
})

autoSaveBtn.addEventListener('change', () => {
    autoSettings.autoSave = autoSaveBtn.checked
    dispatchAutoSettings()
})

autoSyncBtn.addEventListener('change', () => {
    autoSettings.autoSync = autoSyncBtn.checked
    dispatchAutoSettings()
})
