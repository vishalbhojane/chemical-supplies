const API_URL = '/data.json'
const HEADER = document.querySelector('header')
const ACTIONS_CONTAINER = document.querySelector('.actions-container')
const FORM = document.querySelector('#form')
const TABLE = document.querySelector('#table')
let LAST_SAVED_DATA = []
let UI_DATA = []
let IS_UNSAVED_CHANGES = false
const SELECTED_ROW = { data: null, html: null }

// Changes Observer
const OBSERVER = new MutationObserver(function () {
    IS_UNSAVED_CHANGES = true
})
const OBSERVER_CONFIG = { attributes: false, childList: true, subtree: true }

// Data Functions
async function fetchData(url) {
    try {
        const res = await fetch(url)
        const json = await res.json()
        return json
    } catch (e) {
        console.log(e)
        return []
    }
}

function getUIDataItemIndex(id) {
    return UI_DATA.findIndex(el => el.id === id)
}

function swapArrayItems(arr, index1, index2) {
    const temp = arr[index1]
    arr[index1] = arr[index2]
    arr[index2] = temp
}

function saveData() {
    LAST_SAVED_DATA = JSON.parse(JSON.stringify(UI_DATA))
}

function save() {
    saveData()
    IS_UNSAVED_CHANGES = false
}

function resetSelectionData() {
    SELECTED_ROW.data = null
    SELECTED_ROW.html = null
}

function refreshUIData() {
    UI_DATA = JSON.parse(JSON.stringify(LAST_SAVED_DATA))
}

function sortUIData(property, dir, type) {
    UI_DATA.sort((a, b) => {
        if (type === 'string') {
            if (dir === 'asc') {
                return a[property].localeCompare(b[property], undefined, { numeric: true })
            } else {
                return b[property].localeCompare(a[property], undefined, { numeric: true })
            }
        } else if (type === 'number') {
            if (dir === 'asc') {
                return a[property] - b[property]
            } else {
                return b[property] - a[property]
            }
        } else {
            console.log(`Unsupported type: ${type}`)
            return 0
        }
    })
}

// UI Functions
function createCell(text) {
    const cell = document.createElement('td')
    cell.textContent = text
    return cell
}

function createRow(obj, index) {
    const row = document.createElement('tr')

    const selectBox = createCell(`\u2714`)
    selectBox.classList.add('select-box')
    row.appendChild(selectBox)

    row.dataset.id = obj['id']
    const rowIndexCell = createCell(index)
    row.appendChild(rowIndexCell)

    for (const key in obj) {
        if (key === 'id') {
            continue
        }

        const cell = createCell(obj[key])
        cell.dataset.property = key
        row.appendChild(cell)
    }

    return row
}

function createTableBody(arrayOfObjs) {
    const fragment = document.createDocumentFragment()

    const tbody = document.createElement('tbody')
    fragment.appendChild(tbody)

    arrayOfObjs.forEach((obj, index) => {
        const row = createRow(obj, index + 1)
        tbody.appendChild(row)
    })
    return fragment
}

function selectRow(row) {
    const clickedRow = row

    removeAllModes()

    if (clickedRow.classList.contains('active')) {
        clickedRow.classList.remove('active')

        resetSelectionData()
        idealMode()
    } else {
        const allRows = TABLE.lastElementChild.children
        for (let i = 0; i < allRows.length; i++) {
            allRows[i].classList.remove('active')
        }
        clickedRow.classList.add('active')
        SELECTED_ROW.data = UI_DATA[getUIDataItemIndex(clickedRow.dataset.id)]

        SELECTED_ROW.html = clickedRow
        selectedMode()
    }
}

function deleteRow() {
    if (SELECTED_ROW.data === null || SELECTED_ROW.html === null) {
        return
    }

    let currentRow = SELECTED_ROW.html
    let currentRowIndex = parseInt(currentRow.children[1].textContent)
    while (currentRow) {
        currentRow.children[1].textContent = currentRowIndex - 1
        currentRowIndex++
        currentRow = currentRow.nextElementSibling
    }

    SELECTED_ROW.html.remove()

    const deletedItemDataIndex = getUIDataItemIndex(SELECTED_ROW.data.id)
    UI_DATA.splice(deletedItemDataIndex, 1)

    resetSelectionData()
    removeAllModes()
    idealMode()
}

function moveRowUp() {
    if (SELECTED_ROW.data === null || SELECTED_ROW.html === null) {
        return
    }

    const currentRow = SELECTED_ROW.html
    const previousRow = currentRow.previousElementSibling

    if (previousRow) {
        const previousRowDataId = getUIDataItemIndex(previousRow.dataset.id)
        currentRow.parentNode.insertBefore(currentRow, previousRow)
        swapRowIndex(previousRow, currentRow)
        swapArrayItems(UI_DATA, previousRowDataId, previousRowDataId + 1)
    }
}

function moveRowDown() {
    if (SELECTED_ROW.data === null || SELECTED_ROW.html === null) {
        return
    }

    const currentRow = SELECTED_ROW.html
    const nextRow = currentRow.nextElementSibling

    if (nextRow) {
        const nextItemDataIndex = getUIDataItemIndex(nextRow.dataset.id)
        currentRow.parentNode.insertBefore(nextRow, currentRow)
        swapRowIndex(nextRow, currentRow)
        swapArrayItems(UI_DATA, nextItemDataIndex, nextItemDataIndex - 1)
    }
}

function renderTableUI(data) {
    const html = createTableBody(data)
    TABLE.lastElementChild.remove()
    TABLE.append(html)
}

function refresh() {
    if (IS_UNSAVED_CHANGES) {
        const userConfimation = window.confirm('Contains Unsaved Changes, Refresh?')

        if (!userConfimation) return
    }

    OBSERVER.disconnect()
    refreshUIData()
    renderTableUI(UI_DATA)
    removeAllModes()
    idealMode()
    IS_UNSAVED_CHANGES = false
    OBSERVER.observe(TABLE, OBSERVER_CONFIG)
}

function swapRowIndex(row1, row2) {
    const index1 = row1.children[1].textContent
    const index2 = row2.children[1].textContent

    row1.children[1].textContent = index2
    row2.children[1].textContent = index1
}

function populateForm(data) {
    FORM.chemical_name.value = data.chemical_name
    FORM.vendor.value = data.vendor
    FORM.density.value = data.density
    FORM.viscosity.value = data.viscosity
    FORM.packaging.value = data.packaging
    FORM.pack_size.value = data.pack_size
    FORM.unit.value = data.unit
    FORM.quantity.value = data.quantity
}

function toggleForm() {
    if(HEADER.classList.contains('show-form')){
        delete FORM.dataset.mode
        HEADER.classList.remove('show-form')
    } else {
        HEADER.classList.add('show-form')
    }
}

function edit() {
    FORM.dataset.mode = 'edit'
    toggleForm()
    populateForm(SELECTED_ROW.data)
}

function addNew(){
    FORM.dataset.mode = 'add'
    toggleForm()
}

function removeAllModes() {
    HEADER.classList.remove('show-add-new', 'show-edit', 'show-delete', 'show-moveup', 'show-movedown', 'show-refresh', 'show-save')
}

function idealMode() {
    HEADER.classList.add('show-add-new', 'show-refresh', 'show-save')
}

function selectedMode() {
    HEADER.classList.add('show-edit', 'show-delete', 'show-moveup', 'show-movedown', 'show-refresh', 'show-save')
}

function formMode() {
    HEADER.classList.add('show-add-new')
}

// Init
fetchData(API_URL)
    .then(res => {
        const resStr = JSON.stringify(res)
        LAST_SAVED_DATA = JSON.parse(resStr)
        UI_DATA = JSON.parse(resStr)

        const html = createTableBody(UI_DATA)
        TABLE.append(html)

        TABLE.addEventListener('click', function (e) {

            const clickedArea = e.target

            if (clickedArea.classList.contains('select-box')) {
                selectRow(clickedArea.parentElement)
            }

            if (clickedArea.dataset.sortProperty !== undefined) {
                const direction = clickedArea.dataset.sortDirection
                sortUIData(clickedArea.dataset.sortProperty, direction, clickedArea.dataset.sortType)
                clickedArea.dataset.sortDirection = direction === "asc" ? "dsc" : "asc"

                resetSelectionData()
                renderTableUI(UI_DATA)
            }
        })

        ACTIONS_CONTAINER.addEventListener('click', function (e) {
            const button = e.target.closest('button')
            if (!button) return

            const action = e.target.dataset.action

            switch (action) {
                case 'edit': edit()
                    break

                case 'add-new': addNew()
                    break

                case 'moveup': moveRowUp()
                    break

                case 'movedown': moveRowDown()
                    break

                case 'delete': deleteRow()
                    break

                case 'refresh': refresh()
                    break

                case 'save': save()
                    break

                default: return
            }
        })

        FORM.addEventListener('submit', function (e) {
            e.preventDefault()
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())

            if (FORM.dataset.mode === 'edit') {
                const id = SELECTED_ROW.data.id
                UI_DATA[getUIDataItemIndex(id)] = { id: id, ...data }
                FORM.dataset.mode = 'add'
            } else {
                const id = `${new Date().getTime()}`
                UI_DATA.push({ id: id, ...data })
            }

            FORM.reset()
            toggleForm()

            renderTableUI(UI_DATA)
            resetSelectionData()
            removeAllModes()
            idealMode()
        })

        OBSERVER.observe(TABLE, OBSERVER_CONFIG)

    }).catch(function (e) {
        console.log(e)
    })