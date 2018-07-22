fetch('/data')
    .then( response => {
        return response.json();
    })
    .then( data => {
        generateHTML(data);
    })
    .then( () => {
        eventHandlers();
    })
    .catch( err => { return console.log('ERROR', err) })

const generateHTML = (data) => {
    let container = document.getElementById('root');
    
    let sourceHead = document.createElement('h2');
    let newsSource = document.createTextNode(data.source);
    
    sourceHead.appendChild(newsSource);
    container.appendChild(sourceHead);
    let list = document.createElement('ul');
    
    data.headlines.forEach( item => {            
        let listItem = document.createElement('li');
        let anchor = document.createElement('a');
        let content = document.createTextNode(item.title);
        
        let link = document.createAttribute('href');
        link.value = item.link;
        anchor.setAttributeNode(link);

        let detailClass = document.createAttribute('class');
        detailClass.value = 'detail';
        anchor.setAttributeNode(detailClass);

        // let target = document.createAttribute('target');
        // target.value = '_blank';
        // anchor.setAttributeNode(target);

        let detailContainer = document.createElement('div');
        let detailContainerClass = document.createAttribute('class');
        detailContainerClass.value = 'detailContainer collapsed';
        detailContainer.setAttributeNode(detailContainerClass);

        
        anchor.appendChild(content);
        listItem.appendChild(anchor);
        listItem.appendChild(detailContainer);

        list.appendChild(listItem);
        
    });

    container.appendChild(list);

}

const showMore = (data, target) => {
    var el = target.nextSibling;
    if(el.className.indexOf('collapsed') !== -1 ){
        el.className = el.className.replace(/collapsed/,'expanded');
        if(el.innerHTML === '') {
            let container = document.createElement('p');
            let content = document.createTextNode(data.content);
            container.appendChild(content);
            el.appendChild(container);

            let date = document.createElement('p');
            let dateContent = document.createTextNode(data.date);
            let dateClass = document.createAttribute('class');
            dateClass.value = 'date';
            date.setAttributeNode(dateClass);
            date.appendChild(dateContent);
            el.appendChild(date);

            let link = document.createElement('a');
            let linkContent = document.createTextNode('Link to news');
            let href = document.createAttribute('href');
            href.value = data.link;
            link.setAttributeNode(href);
            
            link.appendChild(linkContent);
            el.appendChild(link);
        }
    } else if(el.className.indexOf('expanded') !== -1){
        el.className = el.className.replace(/expanded/,'collapsed');
    }
}

const eventHandlers = () => {
    
    const detailClasses = document.getElementsByClassName('detail');
    
    function getDetailNews(evt) {
        
        fetch(evt.target.attributes.href.value)
            .then( response => {
                return response.json();
            })
            .then( data => {
                showMore(data, evt.target);
            })
            .catch( err => { return console.log('ERROR', err) })
            }

    for (var i = 0; i < detailClasses.length; i++) {
        detailClasses[i].addEventListener('click', function(evt) {
            if(evt.target.nextSibling.innerHTML === '') {
                evt.preventDefault();
                getDetailNews(evt);
            } else {
                evt.preventDefault();
                showMore({}, evt.target);
            }
        }, false);
    }
    
}

