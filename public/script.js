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
    
    // let sourceHead = document.createElement('h2');
    // let newsSource = document.createTextNode(data.source);
    
    // sourceHead.appendChild(newsSource);
    // container.appendChild(sourceHead);
    let list = document.createElement('ul');
    
    data.headlines.forEach( item => {            
        let listItem = document.createElement('li');
        let anchor = document.createElement('a');
        let content = document.createTextNode(item.title);
        
        let link = document.createAttribute('href');
        link.value = item.link;
        anchor.setAttributeNode(link);


        let spinner = document.createElement('div');
        let spinnerClass = document.createAttribute('class');
        spinnerClass.value = 'lds-ellipsis hide';
        spinner.setAttributeNode(spinnerClass);

        let spinner1 = document.createElement('div');
        spinner.appendChild(spinner1);

        let spinner2 = document.createElement('div');
        spinner.appendChild(spinner2);

        let spinner3 = document.createElement('div');
        spinner.appendChild(spinner3);

        let spinner4 = document.createElement('div');
        spinner.appendChild(spinner4);

        let detailClass = document.createAttribute('class');
        detailClass.value = 'detail';
        listItem.setAttributeNode(detailClass);

        // let target = document.createAttribute('target');
        // target.value = '_blank';
        // anchor.setAttributeNode(target);

        let detailContainer = document.createElement('div');
        let detailContainerClass = document.createAttribute('class');
        detailContainerClass.value = 'detailContainer collapsed';
        detailContainer.setAttributeNode(detailContainerClass);

        
        anchor.appendChild(content);
        listItem.appendChild(anchor);
        listItem.appendChild(spinner);

        listItem.appendChild(detailContainer);

        list.appendChild(listItem);
        
    });

    container.appendChild(list);

}

// var position = 0;

const showMore = (data, target) => {
    var el = target.getElementsByClassName('detailContainer')[0];

    if(el.className.indexOf('collapsed') !== -1 ){
        // position = target.offsetTop;
        el.className = el.className.replace(/collapsed/,'expanded');
        if(el.innerHTML === '') {
            
            let date = document.createElement('p');
            let dateContent = document.createTextNode(data.date);
            let dateClass = document.createAttribute('class');
            dateClass.value = 'date';
            date.setAttributeNode(dateClass);
            date.appendChild(dateContent);
            el.appendChild(date);

            data.content.forEach( para => {
                let container = document.createElement('p');
                let content = document.createTextNode(para.text);
                
                para.images.forEach( image => {
                    let img = document.createElement('img');
                    let src = document.createAttribute('src');
                    src.value = image;

                    img.setAttributeNode(src);
                    el.appendChild(img);    
                });
                
                
                container.appendChild(content);
                el.appendChild(container);
            });
            
            let link = document.createElement('a');
            let linkContent = document.createTextNode('Source');
            let href = document.createAttribute('href');
            let linkClass = document.createAttribute('class');
            linkClass.value = 'source';
            link.setAttributeNode(linkClass);

            href.value = data.link;
            link.setAttributeNode(href);
            
            link.appendChild(linkContent);
            el.appendChild(link);

            link.addEventListener('click', function(evt) {
                evt.stopPropagation();
            } )
            
        }
    } else if(el.className.indexOf('expanded') !== -1){
        // window.scrollTo(0, position - 10);
        el.className = el.className.replace(/expanded/,'collapsed');
    }
}

const eventHandlers = () => {
    
    const detailClasses = document.getElementsByClassName('detail');
    
    function getDetailNews(target) {
        
        fetch(target.getElementsByTagName('a')[0].href)
            .then( response => {
                return response.json();
            })
            .then( data => {
                target.getElementsByClassName('lds-ellipsis')[0].attributes.class.value = 'lds-ellipsis hide';
                showMore(data, target);
            })
            .catch( err => { return console.log('ERROR', err) })
            }

    for (var i = 0; i < detailClasses.length; i++) {
        detailClasses[i].addEventListener('click', function(evt) {
            if(evt.currentTarget.getElementsByClassName('detailContainer')[0].innerHTML === '') {
                evt.currentTarget.getElementsByClassName('lds-ellipsis')[0].attributes.class.value = 'lds-ellipsis';
                // el.previousElementSibling.className = el.previousElementSibling.className.replace(/hide/,'show')
                evt.preventDefault();
                getDetailNews(evt.currentTarget);
            } else {
                evt.preventDefault();
                showMore({}, evt.currentTarget);
            }
        }, false);
    }


    
}



