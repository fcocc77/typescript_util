
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

export const print = (info: any) => {
    console.log(info)
}

export const validateEmail = (email: string) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const outside_click = (parent: HTMLElement, func: () => void) => {
    // esta funcion crea un evento para cuando hacemos click fuera de un elemento y sus hijos,
    // para que el click no afecte cuando clickeamos en el elemendo
    const remove = () =>
        document.removeEventListener('mousedown', handleClickOutside)

    const handleClickOutside = (e: any) => {
        if (parent && !parent.contains(e.target)) {
            func()
            remove()
        }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return remove
}

export function format_string(_string: string, spaces: boolean = false) {
    if (spaces)
        return _string.replace(/ /g, "_").toLowerCase()
    else
        return (_string.charAt(0).toUpperCase() + _string.slice(1)).replace(/_/g, ' ')
}

export const second_to_format = (second: number): string => {

    second = Math.round(second);

    const divisor_for_minutes: number = second % (60 * 60);
    const minutes: number = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds: number = divisor_for_minutes % 60;
    let seconds: number | string = Math.ceil(divisor_for_seconds);

    if (seconds < 10)
        seconds = "0" + seconds.toString()

    const format: string = minutes + ":" + seconds;

    return format;
}

export const format_to_second = (format: string): number => {

    const times: string[] = format.split(':').reverse()
    let seconds: number = 0

    for (let key in times) {
        const time: string = times[key]

        if (key == '0') // Seconds
            seconds += Number(time)
        else if (key == '1') // Minutes
            seconds += Number(time) * 60
        else if (key == '2') // Horas
            seconds += Number(time) * 3600
    }

    if (!seconds)
        return 0

    return seconds
}

export const format_to_minutes = (format: string): number[] => {

    const times = format.split(':').reverse()
    const seconds = parseInt(times[0])
    let minutes = parseInt(times[1])

    // si el formato tiene horas, se las suma a los minutos
    if (times.length > 2)
        minutes += parseInt(times[2]) * 60

    if (!seconds)
        return [0, 0]
    return [minutes, seconds]
}

const added_shortcuts = {}
export const shortcut = (keys: string | string[], func: (e: any) => void) => {
    const id = 'shortcut_' + Object.keys(added_shortcuts).length

    const remove = () => {
        const added = added_shortcuts[id]
        if (added) {
            added.map((handle: any) => {
                window.removeEventListener('keydown', handle)
                window.removeEventListener('keyup', handle)
            })

            delete added_shortcuts[id]
        }
    }

    // si el tipo de "keys" es un string significa que es un shortcut de una tecla
    // sino es una array con 2 teclas ej: "Ctrl+A"
    if (typeof (keys) == "string") {
        const onekey_handle = (e: any) => {
            if (e.key == keys || e.code == keys)
                func(e)
        }

        window.addEventListener("keydown", onekey_handle)

        added_shortcuts[id] = [onekey_handle]
    }
    else {
        const first = keys[0]
        const last = keys[1]

        let hold = false

        const hold_handle = (e: any) => {
            if (e.key == first)
                hold = true
        }

        const unhold_handle = (e: any) => {
            if (e.key == first)
                hold = false
        }

        const action_handle = (e: any) => {
            if (e.key.toLowerCase() == last.toLowerCase())
                if (hold) func(e)
        }

        window.addEventListener("keydown", hold_handle)
        window.addEventListener("keyup", unhold_handle)
        window.addEventListener("keydown", action_handle)

        added_shortcuts[id] = [hold_handle, unhold_handle, action_handle]
    }

    return remove
}


export const splitWords = (s: string): string[] => {
    s = s.replace(/(^\s*)|(\s*$)/gi, "");//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi, " ");//2 or more space to 1
    s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
    return s.split(' ').filter(String);
}

export const number_to_string_array = (numbers: number[]): string[] => {
    let strings: string[] = []
    numbers.map((num: number) =>
        strings.push(String(num))
    )

    return strings
}

export const range = (start: number, end?: number | boolean, reverse: boolean = false): number[] => {
    if (typeof end == "boolean") {
        reverse = end
        end = start - 1
        start = 0
    }
    else if (!end) {
        end = start - 1
        start = 0
    }

    let _range = []
    if (!reverse)
        for (let i = start; i <= end; i++)
            _range.push(i)
    else
        for (let i = end; i >= start; i--)
            _range.push(i)

    return _range
}

export const found_parent = (element: any, parent_class: string) => {
    let elem = element
    while (true) {
        if (elem.className == parent_class ||
            elem.tagName == parent_class)
            return elem

        elem = elem.parentNode
        if (elem == null)
            return false
    }
}

export const capitalize = (_string: string): string => {
    return _string.charAt(0).toUpperCase() + _string.slice(1)
}

export const sorted = (array: any): void => {
    function compare(a: any, b: any): number {
        if (a.index > b.index) return 1
        if (b.index > a.index) return -1

        return 0
    }

    return array.sort(compare)
}

export const remove = (value: any, array: any): void => {
    // borra elemento de un array a partir del valor
    let index: number
    // si el valor es un numero asigna el value como index
    if (Number.isInteger(value))
        index = value;
    // ----------------------
    else {
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            // si el item es un string o si es un objeto con atributo "name"
            // asigna el index
            if (item == value || item.name == value || item.title == value || item.basename == value) {
                index = i;
                break;
            }
            // ---------------------------
        }
    }

    if (index != undefined)
        array.splice(index, 1);
}

export const includes = (name: string, array: any[]) => {
    for (let i = 0; i < array.length; i++)
        if (name == array[i].name)
            return true

    return false
}

export const get = (name: string, array: any[]) => {
    const i = array.findIndex((obj: any) => obj.name === name)
    return array[i]
}

export const replace_all = (_string: string, search: string, replacement: string) => {
    return _string.replace(new RegExp(search, 'g'), replacement)
}

export const closeFullscreen = () => {

    const doc = document as Document & {
        mozCancelFullScreen: any
        webkitExitFullscreen: any
        msExitFullscreen: any
    }

    if (document.fullscreen)
        document.exitFullscreen()

    else if (doc.mozCancelFullScreen)  /* Firefox */
        doc.mozCancelFullScreen()

    else if (doc.webkitExitFullscreen)  /* Chrome, Safari and Opera */
        doc.webkitExitFullscreen()

    else if (doc.msExitFullscreen)  /* IE/Edge */
        doc.msExitFullscreen()
}

export const add_font = (font: string, url: string) => {
    let style = document.head.querySelector('#fonts')
    if (!style) {
        style = document.createElement('style')
        style.id = 'fonts'
        document.head.appendChild(style);
    }
    style.innerHTML += "@font-face { font-family: '" + font + "'; src: url('" + url + "'); }"
}

export const load_picture = (url: string, callback: (load: boolean) => void) => {
    const image = new Image()
    image.src = url

    image.onload = () => {
        callback(true)
    }
    image.onerror = () => {
        callback(false)
    }
}
