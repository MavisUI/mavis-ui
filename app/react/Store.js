import {observable} from 'mobx';

export default class Store {
    @observable currentPage = 'report';
    @observable pageTitle = 'Report';
    @observable showMainMenu = false;
    @observable isLoading = false;
    @observable loadingMessage = '';

}