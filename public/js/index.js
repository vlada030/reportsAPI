// bez ovoga ne radi npr async/await... i blokira celu app
import '@babel/polyfill';
import {getProduct, updateProduct, deleteReport} from './ajaxRequests';
import errorHandler from './errorHandler';
import {showMessage, deleteMessage} from './alertMessage';
import {elements, updateReportsUI, updateProductUI, addItem, delItem, updateTotalLength, addWorker, removeWorker, addItemDorada, removeItemDorada, addItemProboj, removeItemProboj} from './userInterface';



// provera da li postoji proizvod sa zadatom šifrom dom/exp Reports
if (elements.productCode) {
    elements.productCode.addEventListener('input', async (e) => {
        e.preventDefault();
        try {
            // 1. proveri početno stanje
            // obriši alert poruku ako je ima
            deleteMessage();
            // uradi update product polja
            updateReportsUI(void 0);
            // proveri button SAVE / PDF da li su disabled
            elements.saveButton.removeAttribute('disabled');
            elements.savePDFButton.removeAttribute('disabled');

            // NE PRAVI NEPOTREBAN ZAHTEV AKO SIFRA NIJE DUŽINE 7
            if (elements.productCode.value.trim().length !== 7) {
                // blokiraj SAVE button
                elements.saveButton.setAttribute('disabled', 'true');
                elements.savePDFButton.setAttribute('disabled', 'true');
                throw new Error('Šifra proizvoda se sastoji iz 7 cifara');
            }
            const product = await getProduct(elements.productCode.value.trim());
            console.log(product)
            if (product && typeof(product.data) === 'string') {
                // AKO JE PRODUCT:DATA STRING , RESPONSE PAYLOAD JE LOGIN PAGE - HTML STRING
                elements.saveButton.setAttribute('disabled', 'true');
                elements.savePDFButton.setAttribute('disabled', 'true'); 
                showMessage('Niste logovani', 'error')
            } else {
                //AKO POSTOJI PROIZVOD UPDATE UI
                console.log(product.data.data[0])
                updateReportsUI(product.data.data[0]);
            }
            
        } catch (error) {
            errorHandler(error);
        }       
    });
}
// provera da li postoji proizvod sa zadatom šifrom prilikom updejta proizvoda
if (elements.updateProductCode) {
    elements.updateProductCode.addEventListener('input', async (e) => {
        e.preventDefault();
        try {
            // 1. proveri početno stanje
            // obriši alert poruku ako je ima
            deleteMessage();
            // uradi update product polja
            updateProductUI(void 0);
            // proveri button SAVE / PDF da li su disabled
            elements.saveUpdateButton.removeAttribute('disabled');

            // NE PRAVI NEPOTREBAN ZAHTEV AKO SIFRA NIJE DUŽINE 7
            if (elements.updateProductCode.value.trim().length !== 7) {
                // blokiraj SAVE button
                elements.saveUpdateButton.setAttribute('disabled', 'true');
                throw new Error('Šifra proizvoda se sastoji iz 7 cifara');
            }
            console.log(updateProductCode.value);
            const product = await getProduct(updateProductCode.value.trim());
            if (product) {
                // AKO POSTOJI PROIZVOD UPDATE UI
                console.log(product.data.data[0])
                updateProductUI(product.data.data[0]);    
            } 
            
        } catch (error) {
            errorHandler(error);
        }       
    });
}

// ZATVORI INFO PROZOR / MODAL...
window.addEventListener('click', (e) => {
    if (e.target.matches('.close')) {
        deleteMessage();
    }
})

// RESETUJ POLJA DOMREPORT FORME
// const resetDomReportsForm = () => {
//     document.getElementById('sifra').value = '';
//     document.getElementById('radniNalog').value = '';
//     document.getElementById('MISBroj').value = '';
//     document.getElementById('duzina').value = '';
//     document.getElementById('neto').value = '';
//     document.getElementById('bruto').value = '';
// }


// OBRIŠI DOMREPORT/EXPREPORT IZ BAZE
window.addEventListener('click',async (e) => {
    // kada je klinkuto dugme Obriši na modalu
    if (e.target.matches('#eraseReport')) {
        try {
            const eraseID = e.target;
            const reportId = eraseID.dataset.reportid;
            const kindOfReport = eraseID.dataset.report || '';
            console.log(reportId, kindOfReport);

            await deleteReport(reportId, kindOfReport);
            showMessage('Izveštaj je uspešno obrisan.', 'success');

            window.setTimeout(() => {
                // MIS broj ima 7 cifre za dom report, exp je ObjectId, shift isto ima ObjectId
                if (reportId.length === 7) {
                    location.assign('/api/v2/reports/dom');            
                } else if (kindOfReport==='shift') {
                    location.assign('/api/v2/reports/shift');
                } else {
                    location.assign('/api/v2/reports/exp');                    
                }
            }, 1500)
            
        } catch (error) {
            errorHandler(error);
        }
    }
})

// POŠALJI PUT REQUEST ZA UPDATE PROIZVODA
if (elements.productHandleForm) {
    elements.saveUpdateButton.addEventListener('click',async (e) => {
        e.preventDefault();
        try {
            let data = {};

             // obriši alert poruku ako je ima
             deleteMessage();

            // pretvori node list u array
            let formData = Array.from(elements.productHandleForm.elements);
            // kreiraj data object {name: value} i izbaci button element i csrf token input
            formData.forEach(el => {
                if (el.getAttribute('type') !== 'hidden' && el.tagName.toLowerCase() !== 'button') {
                    data[el.name] = el.value;
                }        
            })
            const result = await updateProduct(data.sifra, data);
            console.log(result);  
            
            if (result.data.success === true) {
                showMessage('Proizvod je uspešno izmenjen.', 'success');
                window.setTimeout(() => {
                    location.assign('/api/v2/reports/dom');                
                }, 1000)
            }
            
        } catch (error) {
            errorHandler(error);
        }
    })
}

// EXP REPORTS FORMA DODAJ / OBRIŠI STAVKU, PRERACUNAJ UKUPNU DUZINU
if (elements.expReportsForm) {
    // dodaj stavku
    elements.addItemButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        let n = document.querySelector('#drumList>div:last-child').dataset.next;
        if (n <= 20) {
            addItem(n);
        } else {
            showMessage('Najviše možete da dodate 20 stavki', 'error');
        }
    })

    // obrisi stavku
    elements.delItemButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        // obrisi stavku
        delItem();
        // preracunaj ponovo ukupnu duzinu
        updateTotalLength();
    })

    // updejtovanje total length polja prilikom unosa nove duzine
    elements.drumList.addEventListener('input', function() {
        updateTotalLength();                
        
    });
}

// SHIFT REPORTS FORMA
if (elements.shiftReportsForm) {
    // dodaj radnika
    elements.addWorkerButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        let n = document.querySelector('#workersList>tr:last-child').dataset.next;
        if (n <= 11) {
            addWorker(n);
        } else {
            showMessage('Najviše možete da dodate 10 radnika', 'error');
        }
    })

    // obriši radnika
    elements.removeWorkerButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        // obrisi stavku
        removeWorker();
        
    })

    // dodaj stavku Dorada
    elements.addItemDoradaButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        let n = document.querySelector('#doradaList>tr:last-child').dataset.next;
        if (n <= 11) {
            addItemDorada(n);
        } else {
            showMessage('Najviše možete da dodate 10 stavke', 'error');
        }
    })

    // obriši stavku Dorada
    elements.removeItemDoradaButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        // obrisi stavku
        removeItemDorada();
        
    })

    // dodaj stavku Proboj
    elements.addItemProbojButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        let n = document.querySelector('#probojList>tr:last-child').dataset.next;
        if (n <= 11) {
            addItemProboj(n);
        } else {
            showMessage('Najviše možete da dodate 10 stavke', 'error');
        }
    })

    // obriši stavku Proboj
    elements.removeItemProbojButton.addEventListener('click', e => {
        e.preventDefault();
        // obriši poruku ako postoji
        deleteMessage();
        // obrisi stavku
        removeItemProboj();
        
    })
}