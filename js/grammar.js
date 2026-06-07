document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const tableRows = document.querySelectorAll('.grammar-table tbody tr');

  if (filterButtons.length === 0 || tableRows.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Bỏ active của tất cả các nút
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Thêm active cho nút hiện tại
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Lọc các dòng
      tableRows.forEach(row => {
        const category = row.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          // Hiển thị dòng bằng animation
          row.classList.remove('hide-row');
          row.classList.add('show-row');
        } else {
          // Ẩn dòng
          row.classList.remove('show-row');
          row.classList.add('hide-row');
        }
      });
    });
  });
});
