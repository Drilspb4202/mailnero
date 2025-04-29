/**
 * UI Fixes - Исправления для предотвращения ошибок с undefined элементами
 * Подключается перед основными скриптами
 */
(function() {
    console.log('Инициализация UI Fixes для предотвращения ошибок undefined');
    
    // Сохраняем оригинальный метод createElement для расширения
    const originalCreateElement = document.createElement;
    
    // Предотвращение ошибок с textContent для undefined элементов
    Element.prototype._safeSetTextContent = function(text) {
        try {
            this.textContent = text;
            return true;
        } catch (error) {
            console.warn('Ошибка при установке текста для элемента:', error);
            return false;
        }
    };
    
    // Утилита для безопасного получения элемента и установки его textContent
    window.safeSetElementText = function(elementId, text) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element._safeSetTextContent(text);
                return true;
            }
            console.warn(`Элемент с ID "${elementId}" не найден`);
            return false;
        } catch (error) {
            console.error(`Ошибка при установке текста для элемента "${elementId}":`, error);
            return false;
        }
    };
    
    // Функция для создания toast уведомления, если его нет
    window.ensureToastExists = function() {
        try {
            let toast = document.getElementById('toast');
            
            if (!toast) {
                console.log('Toast элемент не найден, создаем его динамически');
                
                // Проверяем готовность DOM
                if (!document || !document.body) {
                    console.error('DOM не готов для создания toast элемента');
                    
                    // Если DOM не готов, пробуем отложить создание через таймер
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            const createdToast = ensureToastExists();
                            resolve(createdToast);
                        }, 100);
                    });
                }
                
                try {
                    toast = document.createElement('div');
                    toast.id = 'toast';
                    toast.className = 'toast';
                    
                    // Устанавливаем базовые инлайн-стили, на случай если CSS не загрузился
                    toast.style.position = 'fixed';
                    toast.style.top = '20px';
                    toast.style.right = '20px';
                    toast.style.zIndex = '9999';
                    toast.style.backgroundColor = '#333';
                    toast.style.color = 'white';
                    toast.style.padding = '12px 20px';
                    toast.style.borderRadius = '4px';
                    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.3s, transform 0.3s';
                    toast.style.transform = 'translateY(-20px)';
                    toast.style.pointerEvents = 'none';
                    toast.style.maxWidth = '80%';
                    toast.style.fontSize = '14px';
                    toast.style.wordWrap = 'break-word';
                    
                    // Создаем запасной текстовый узел
                    const textNode = document.createTextNode('');
                    toast.appendChild(textNode);
                    
                    document.body.appendChild(toast);
                    
                    // Добавляем базовые стили для toast активации
                    const styleForActive = document.createElement('style');
                    styleForActive.textContent = `
                        .toast.active {
                            opacity: 1 !important;
                            transform: translateY(0) !important;
                        }
                        .toast.success {
                            background-color: #4caf50 !important;
                        }
                        .toast.error {
                            background-color: #f44336 !important;
                        }
                        .toast.warning {
                            background-color: #ff9800 !important;
                        }
                        .toast.info {
                            background-color: #2196f3 !important;
                        }
                    `;
                    document.head.appendChild(styleForActive);
                    
                    console.log('Toast элемент успешно создан');
                } catch (error) {
                    console.error('Ошибка при создании toast элемента:', error);
                    return null;
                }
            }
            
            return toast;
        } catch (error) {
            console.error('Критическая ошибка при создании toast элемента:', error);
            return null;
        }
    };
    
    // Функция для безопасного отображения уведомления
    window.showSafeToast = function(message, type = '', duration = 3000) {
        try {
            const toast = ensureToastExists();
            
            if (!toast) {
                console.error('Не удалось отобразить уведомление (toast не создан):', message);
                console.log(message); // Запасной вариант - выводим в консоль
                return;
            }
            
            // Установка типа уведомления
            try {
                toast.className = 'toast';
                if (type) {
                    toast.classList.add(type);
                }
            } catch (error) {
                console.error('Ошибка при установке класса для toast:', error);
                // Продолжаем выполнение, это не критическая ошибка
            }
            
            // Безопасная установка текста
            try {
                if (toast && typeof toast.textContent !== 'undefined') {
                    toast.textContent = message;
                } else {
                    // Если textContent недоступен, пробуем innerText
                    if (toast && typeof toast.innerText !== 'undefined') {
                        toast.innerText = message;
                    } else {
                        // Если и это не работает, пробуем innerHTML
                        if (toast && typeof toast.innerHTML !== 'undefined') {
                            // Экранируем HTML для безопасности
                            toast.innerHTML = message
                                .replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/"/g, '&quot;')
                                .replace(/'/g, '&#039;');
                        } else {
                            console.error('Не удалось установить текст уведомления - нет доступных методов');
                            console.log(message);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('Ошибка при установке текста уведомления:', error);
                console.log(message); // Запасной вариант - выводим в консоль
                return;
            }
            
            // Показываем уведомление
            try {
                toast.classList.add('active');
            } catch (error) {
                console.error('Ошибка при добавлении класса active:', error);
                // Не критично, продолжаем
            }
            
            // Автоматически скрываем через duration мс
            try {
                clearTimeout(window.toastTimeout);
                window.toastTimeout = setTimeout(() => {
                    if (toast) {
                        try {
                            toast.classList.remove('active');
                        } catch (error) {
                            console.error('Ошибка при удалении класса active:', error);
                        }
                    }
                }, duration);
            } catch (error) {
                console.error('Ошибка при настройке таймера скрытия уведомления:', error);
            }
        } catch (error) {
            console.error('Критическая ошибка при отображении уведомления:', error);
            console.log(message); // Запасной вариант - выводим в консоль
        }
    };
    
    // Перехватываем оригинальный showToast в прототипе MailSlurpUI, если он загружен
    document.addEventListener('DOMContentLoaded', function() {
        try {
            if (window.MailSlurpUI && MailSlurpUI.prototype) {
                const originalShowToast = MailSlurpUI.prototype.showToast;
                
                // Заменяем оригинальный метод на безопасную версию
                MailSlurpUI.prototype.showToast = function(message, type = '', duration = 3000, translate = false) {
                    try {
                        // Если нужно перевести сообщение
                        let displayMessage = message;
                        if (translate && window.i18n && typeof window.i18n.translate === 'function') {
                            displayMessage = window.i18n.translate(message);
                        }
                        
                        // Используем безопасную функцию
                        window.showSafeToast(displayMessage, type, duration);
                    } catch (error) {
                        console.error('Ошибка в перехваченном showToast:', error);
                        // Запасной вариант - попытка использовать оригинальный метод
                        try {
                            originalShowToast.call(this, message, type, duration, translate);
                        } catch (e) {
                            console.error('Критическая ошибка в showToast:', e);
                            console.log(message);
                        }
                    }
                };
                
                console.log('Метод showToast успешно перехвачен и заменен на безопасную версию');
                
                // Безопасный метод для установки текста элемента
                MailSlurpUI.prototype.safeSetTextContent = function(elementId, text) {
                    return window.safeSetElementText(elementId, text);
                };
            }
        } catch (error) {
            console.error('Не удалось перехватить метод showToast:', error);
        }
    });
    
    // Создаем toast элемент заранее, чтобы он был готов к использованию
    document.addEventListener('DOMContentLoaded', function() {
        ensureToastExists();
        console.log('UI Fixes успешно инициализированы');
    });
})(); 