import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function ReferralModal({showModal, handleClose, referralLink}) {
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            console.log('Referral link copied to clipboard');
            setCopySuccess(true);
            setTimeout(() => {
                setCopySuccess(false);
                handleClose();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Your Referral Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mt-3">
                Use this link to invite your friends to our app. If they successfully subscribe using this link, you will receive a free month of subscription. Each friend you invite who successfully signs up will give you an additional month free. Invite more friends to get more benefits!
                </p>
                <p style={{ color: 'blue' }}>{referralLink}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={copyToClipboard}>
                    Copy Link
                </Button>
                {copySuccess && <div style={{color: 'green'}}>Link copiado con éxito!</div>}
            </Modal.Footer>
        </Modal>
    );
}

export default ReferralModal;
