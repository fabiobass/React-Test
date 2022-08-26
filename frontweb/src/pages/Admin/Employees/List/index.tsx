import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { SpringPage } from 'types/vendor/spring';
import { useCallback, useEffect, useState } from 'react';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import './styles.css';
import { hasAnyRoles } from 'util/auth';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();
  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0,
    });

  const handlePageChange = (pageNumer: number) => {
    setControlComponentsData({
      activePage: pageNumer,
    });
  };

  const getList = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      params: {
        page: controlComponentsData.activePage,
        size: 4,
      },
      withCredentials: true,
    };
    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <>
      <Link to="/admin/employees/create">
        {hasAnyRoles(['ROLE_ADMIN']) && (
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        )}
      </Link>

      <div className="row">
        {page?.content.map((employee) => (
          <div key={employee.id} className="col-sm-6 col-md-12">
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={4}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
