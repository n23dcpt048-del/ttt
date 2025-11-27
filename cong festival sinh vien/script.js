document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab and content
            btn.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });

    // Tạo sự kiện
    const openModalBtn = document.getElementById('openModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const createForm = document.getElementById('createEventForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('eventImage');
    const fileName = document.getElementById('fileName');

    // Step navigation elements
    const nextToSocial = document.getElementById('nextToSocial');
    const backToStep1 = document.getElementById('backToStep1');
    const createEventBtn = document.getElementById('createEvent');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Sửa sự kiện
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editModalOverlay = document.getElementById('editModalOverlay');
    const editEventForm = document.getElementById('editEventForm');
    const editButtons = document.querySelectorAll('.edit-event-btn');
    const editUploadBtn = document.getElementById('editUploadBtn');
    const editFileInput = document.getElementById('editEventImage');
    const editFileName = document.getElementById('editFileName');

    // Mở modal tạo sự kiện
    openModalBtn.addEventListener('click', function() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reset về step 1 khi mở modal
        if (step1 && step2) {
            step1.classList.add('active');
            step2.classList.remove('active');
        }
    });

    // Đóng modal tạo sự kiện
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Đóng khi click ra ngoài modal tạo
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Xử lý upload file cho modal tạo
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'Chưa có ảnh nào được chọn';
        }
    });

    // Step navigation - Chuyển đến bước 2
    if (nextToSocial) {
        nextToSocial.addEventListener('click', function() {
            // Kiểm tra form trước khi chuyển
            const eventName = document.getElementById('eventName').value;
            if (!eventName) {
                alert('Vui lòng nhập tên sự kiện');
                return;
            }
            
            step1.classList.remove('active');
            step2.classList.add('active');
        });
    }

    // Step navigation - Quay lại bước 1
    if (backToStep1) {
        backToStep1.addEventListener('click', function() {
            step2.classList.remove('active');
            step1.classList.add('active');
        });
    }

    // Step navigation - Tạo sự kiện
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            // Lấy dữ liệu từ form
            const formData = {
                name: document.getElementById('eventName').value,
                description: document.getElementById('eventDescription').value,
                startTime: document.getElementById('eventStartTime').value,
                endTime: document.getElementById('eventEndTime').value,
                deadline: document.getElementById('registrationDeadline').value,
                organization: document.getElementById('eventOrganization').value,
                location: document.getElementById('eventLocation').value,
                link: document.getElementById('registrationLink').value,
                image: fileInput.files[0] ? fileInput.files[0].name : null
            };
            
            // Lấy các kênh mạng xã hội đã chọn
            const selectedChannels = [];
            document.querySelectorAll('input[name="socialChannels"]:checked').forEach(checkbox => {
                selectedChannels.push(checkbox.value);
            });
            formData.channels = selectedChannels;
            
            console.log('Dữ liệu sự kiện:', formData);
            alert('Tạo sự kiện thành công!');
            closeModal();
        });
    }

    // Xử lý submit form tạo sự kiện (cho trường hợp không có step navigation)
    if (createForm && !nextToSocial) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const formData = {
                name: document.getElementById('eventName').value,
                description: document.getElementById('eventDescription').value,
                startTime: document.getElementById('eventStartTime').value,
                endTime: document.getElementById('eventEndTime').value,
                deadline: document.getElementById('registrationDeadline').value,
                organization: document.getElementById('eventOrganization').value,
                location: document.getElementById('eventLocation').value,
                link: document.getElementById('registrationLink').value,
                image: fileInput.files[0] ? fileInput.files[0].name : null
            };
            
            // Xử lý dữ liệu
            console.log('Dữ liệu sự kiện:', formData);
            
            // Hiển thị thông báo
            alert('Tạo sự kiện thành công!');
            
            // Đóng modal
            closeModal();
            
            // Reset form
            createForm.reset();
            fileName.textContent = 'Chưa có ảnh nào được chọn';
        });
    }

    // Mở modal chỉnh sửa sự kiện
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            
            // Giả lập dữ liệu sự kiện
            const eventData = getEventDataById(eventId);
            
            // Điền dữ liệu vào form chỉnh sửa
            document.getElementById('editEventId').value = eventId;
            document.getElementById('editEventName').value = eventData.name;
            document.getElementById('editEventDescription').value = eventData.description;
            document.getElementById('editEventStartTime').value = eventData.startTime;
            document.getElementById('editEventEndTime').value = eventData.endTime;
            document.getElementById('editRegistrationDeadline').value = eventData.deadline;
            document.getElementById('editEventOrganization').value = eventData.organization;
            document.getElementById('editEventLocation').value = eventData.location;
            document.getElementById('editRegistrationLink').value = eventData.link;
            
            editModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Đóng modal chỉnh sửa
    function closeEditModal() {
        editModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        editEventForm.reset();
        editFileName.textContent = 'Chưa có ảnh nào được chọn';
    }

    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);

    // Đóng modal chỉnh sửa khi click bên ngoài
    editModalOverlay.addEventListener('click', function(event) {
        if (event.target === editModalOverlay) {
            closeEditModal();
        }
    });

    // Xử lý upload file cho modal chỉnh sửa
    editUploadBtn.addEventListener('click', function() {
        editFileInput.click();
    });

    editFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            editFileName.textContent = this.files[0].name;
        } else {
            editFileName.textContent = 'Chưa có ảnh nào được chọn';
        }
    });

    // Xử lý submit form chỉnh sửa
    editEventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const formData = {
            id: document.getElementById('editEventId').value,
            name: document.getElementById('editEventName').value,
            description: document.getElementById('editEventDescription').value,
            startTime: document.getElementById('editEventStartTime').value,
            endTime: document.getElementById('editEventEndTime').value,
            deadline: document.getElementById('editRegistrationDeadline').value,
            organization: document.getElementById('editEventOrganization').value,
            location: document.getElementById('editEventLocation').value,
            link: document.getElementById('editRegistrationLink').value,
            image: editFileInput.files[0] ? editFileInput.files[0].name : null
        };
        
        // Xử lý dữ liệu
        console.log('Dữ liệu sự kiện (chỉnh sửa):', formData);
        
        // Hiển thị thông báo
        alert('Cập nhật sự kiện thành công!');
        
        // Đóng modal
        closeEditModal();
    });

    // Đóng bằng phím ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeModal();
            }
            if (editModalOverlay.classList.contains('active')) {
                closeEditModal();
            }
        }
    });

    // Hàm giả lập lấy dữ liệu sự kiện theo ID
    function getEventDataById(id) {
        const events = {
            '1': {
                name: 'Chào Tân Sinh Viên 2025',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
                startTime: '2026-11-09T16:30',
                endTime: '2026-11-09T18:30',
                deadline: '2026-11-08T22:00',
                organization: 'A\'Zone',
                location: 'HVCNBCVT',
                link: 'https://example.com/register'
            },
            // ... các sự kiện khác
        };
        
        return events[id] || {};
    }
});