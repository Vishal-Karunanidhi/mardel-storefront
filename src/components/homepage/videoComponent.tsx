import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { VideoComponentData } from 'src/types/homepage';
import styles from '@Styles/homepage/videoComponent.module.scss';
import { imageUrlQuery } from '@Lib/common/utility';

const Img = styled('img')({
  margin: 'auto',
  display: 'flex'
});

const componentMaterialStyle = {
  imageStyle: {
    imageButton: {
      cursor: 'default'
    }
  },
  playerIconsx: {
    color: '#003087',
    width: { md: '50px', xs: '35px' },
    height: { md: '50px', xs: '35px' },
    position: 'absolute',
    transform: 'translate(-0%, -20%)',
    background: 'white',
    borderRadius: '50%',
    padding: { md: '10px', xs: '6px' },
    textAlign: 'center',
    lineHeight: '100px',
    verticalAlign: 'middle',
    cursor: 'pointer'
  },
  iconsx: {
    float: 'right',
    cursor: 'pointer',
    color: '#FFFFFF',
    width: '16px',
    height: '16px',
    marginTop: '-5px',
    marginRight: '-7px',
    marginBottom: '0px'
  },
  papersx: {
    height: '32px',
    backgroundColor: '#003087',
    width: '100%',
    outline: '#003087',
    outlineOffset: '-3px',
    outlineColor: '#003087',
    outlineStyle: 'solid',
    outlineWidth: '8px',
    borderRadius: '17px 17px 0px 0px'
  }
};

export default function VideoComponent(props: VideoComponentData | any): JSX.Element {
  const { video, description, cta } = props;
  const { playerIconsx, iconsx, papersx } = componentMaterialStyle;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isMobilePlayer, setIsMobilePlayer] = useState<boolean>(true);
  const imageUrl = video?.image?.url;

  const handleReactBootPlayer = (dialogValue: boolean) => {
    setIsDialogOpen(dialogValue);
    setIsMobilePlayer(true);
  };
  const handleMobilePlayer = (mobileValue: boolean) => {
    setIsMobilePlayer(mobileValue);
  };
  const handleVideoEnded = () => {
    setIsMobilePlayer(true);
  };
  function VideoPlayerDialog(props: any): JSX.Element {
    return (
      <Dialog
        maxWidth="xl"
        open={isDialogOpen}
        onClose={() => handleReactBootPlayer(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        {...props}
      >
        <DialogTitle sx={papersx}>
          <CloseIcon sx={iconsx} onClick={() => handleReactBootPlayer(false)} />
        </DialogTitle>
        <DialogContent
          sx={{ marginTop: '8px', paddingLeft: '5px', paddingRight: '5px', paddingBottom: '5px' }}
        >
          <ReactPlayer
            className={styles.reactPlayer}
            url={video?.videolink}
            controls
            playing={true}
          />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <article className={styles.videoElements}>
      <section className={styles.popupPlayer} onClick={() => handleReactBootPlayer(true)}>
        <Img
          alt="Video thumbnail"
          src={imageUrlQuery(imageUrl, 900)}
          className={styles.imageDimension}
        />
        <ArrowRightIcon sx={playerIconsx} />
      </section>
      <section className={styles.inlinePlayer} onClick={() => handleMobilePlayer(false)}>
        {isMobilePlayer ? (
          <>
            <Img
              alt="View thumbnail"
              src={imageUrlQuery(imageUrl, 900)}
              className={styles.imageDimension}
            />
            <ArrowRightIcon sx={playerIconsx} />
          </>
        ) : (
          <ReactPlayer url={video?.videolink} controls playing={true} onEnded={handleVideoEnded} />
        )}
      </section>
      {cta !== undefined && (
        <section className={styles.videoContent}>
          <h2 className={styles.videoTitle}>{video?.videotitle}</h2>
          <p>{description}</p>
          {cta?.value != '' && (
            <Link href={cta?.value} passHref>
              <button
                onPointerDown={(e) => e.preventDefault()}
                onPointerUp={(e) => e.preventDefault()}
                className={styles.ctaButton}
                type="button"
              >
                {cta?.label}
              </button>
            </Link>
          )}
        </section>
      )} 
      <VideoPlayerDialog className={styles.popupPlayerVideo} />
    </article>
  );
}
