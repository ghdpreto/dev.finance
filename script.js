Modal = {
    open(){
        const modal = document.querySelector('.modal-overlay')
        modal.classList.add('active')

        const modal_box = document.querySelector('.modal')
        modal_box.classList.add('animate-up')
    },
    close(){
        const modal = document.querySelector('.modal-overlay')
        modal.classList.remove('active')

        const modal_box = document.querySelector('.modal')
        modal_box.classList.remove('animate-up')
    }
}