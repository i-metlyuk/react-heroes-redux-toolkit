import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { v4 as uuidv4} from 'uuid';

import { heroAdded } from '../../actions';

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [heroElement, setHeroElement] = useState('fire');

    const { filters, filtersLoadingStatus } = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const addHero = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescription,
            element: heroElement
        }

        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
            .then(() => {
                dispatch(heroAdded(newHero));
            })
            .catch(err => console.log(err));
        
        setHeroName('');
        setHeroDescription('');
        setHeroElement('fire');
    }

    const renderFiltersOptionsList = (filters, status) => {
        if (status === 'loading') {
            return <option>Загрузка элементов</option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        return filters.map(({id, name, text}) => {
            if (name !== 'all') {
                return <option key={id} value={name}>{text}</option>
            } else {
                return null;
            }
        })
    }

    const filtersOprionsList = renderFiltersOptionsList(filters, filtersLoadingStatus);

    return (
        <form onSubmit={(e) => addHero(e)} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}
                    required
                    className="form-select" 
                    id="element" 
                    name="element">
                    {
                        filtersOprionsList
                    }
                </select>
            </div>

            <button type='submit' className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;