document.addEventListener('DOMContentLoaded', () => {
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
        const header = item.querySelector('.project-header');
        
        header.addEventListener('click', () => {
            // 获取当前状态
            const isExpanded = item.getAttribute('data-expanded') === 'true';
            
            // 切换状态
            item.setAttribute('data-expanded', !isExpanded);
            
            // 可选：如果想实现手风琴效果（一次只展开一个），取消注释以下代码
            /*
            if (!isExpanded) {
                projectItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.setAttribute('data-expanded', 'false');
                    }
                });
            }
            */
        });
    });

    console.log('简历页面加载完成 - 项目交互功能已就绪');
});

