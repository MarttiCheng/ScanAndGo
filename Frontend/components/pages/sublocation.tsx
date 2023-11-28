import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import http from 'services/http-common';
import { AiOutlineClose, AiFillEdit } from 'react-icons/ai'
import { useAppDispatch, useAppSelector } from 'store/hooks';
import useSubLocationForm from 'components/location/useSubLocationForm';
import { LanguageContext } from 'shared/context/language';

const SubLocationPage = () => {

  const classes = {
    label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
    input: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 focus:outline-none',
    button: 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center'
  }
  const { dictionary } = useContext(LanguageContext);
  const router = useRouter();
  const { id } = router.query;
  const { create, delete: deleteOne, update } = useSubLocationForm();
  const { locationName } = useAppSelector(state => state.location);
  const [name, setName] = useState<string>("");
  const [curId, setCurId] = useState(-1);
  const { account } = useAppSelector(state => state.auth);

  const getAllSubLocation: any = useQuery(
    ['getAllSubLocation', id],
    () => {
      if (id)
        return http.get(`/sublocation/read?id=${id}`)
    }
  )

  const allSubLocation = React.useMemo(() => {
    return getAllSubLocation.data ?
      getAllSubLocation.data.data : []
  }, [getAllSubLocation.data])

  const handleAdd = () => {
    create({ locationId: id, name });
    setName("");
  }

  const handleDelete = (id: string) => {
    deleteOne(id);
  }

  const handleEdit = (id: number, value: string) => {
    setCurId(id);
    setName(value);
  }

  const handleUpdate = () => {
    update({ id: curId, name })
    setCurId(-1);
    setName("");
  }

  const handleCancel = () => {
    setCurId(-1);
    setName("");
  }

  return (
    <div className='px-12 py-16 space-y-12'>
      <div>
        <p className='text-2xl'>{locationName}</p>
      </div>
      <div className='flex items-center gap-8'>
        {account?.role != 3 && <input type='text' className={classes.input} value={name} onChange={(e) => setName(e.target.value)} />}
        {account?.role != 3 && (curId != -1 ? <>
          <button className={classes.button} onClick={handleUpdate}>{dictionary['update']}</button>
          <button className={classes.button} onClick={handleCancel}>{dictionary['cancel']}</button>
        </>
          : <button className={classes.button} onClick={handleAdd}>{dictionary['add']}</button>)}
      </div>
      <div className='flex flex-wrap gap-4'>
        {
          allSubLocation?.map((each: any, index: number) => (
            <div key={index} className='bg-blue-500 hover:bg-green-500 transition-all duration-300 ease-in-out text-white rounded-md flex justify-between items-center hover:cursor-pointer'>
              <div className='pl-8 pr-8 py-1' onClick={() => {
                router.push(`/category/${id}/${each.id}`)
              }}>
                {each.name}
              </div>
              {curId != each.id && account?.role != 3 && <div className='pr-4 py-1' onClick={() => handleEdit(each.id, each.name)}>
                <AiFillEdit className='hover:text-red-500 transition-all duration-300 ease-in-out hover:cursor-pointer' />
              </div>}
              {account?.role != 3 && <div className='pr-4 py-1'>
                <AiOutlineClose onClick={() => handleDelete(each.id)} className='hover:text-red-500 transition-all duration-300 ease-in-out hover:cursor-pointer' />
              </div>}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default SubLocationPage;