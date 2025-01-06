import React, { useState } from 'react';
import Modal from '@/components/ui/modal';

const InfoModal = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = async () => {
        setModalOpen(false);
    };

    return (
        <div onClick={handleOpenModal}>
            <p className='absolute top-4 left-4 z-50 bg-muted rounded p-2'>Navodila za uporabo</p>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                Za dodajanje nove radarske kontrole pritisnite kjerkoli na zemljevidu <br/> Za ogled kontrole pritisnite na ikono policijskega avtomobila.
            </Modal>
        </div>
    );
};

export default InfoModal;